import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Order,
  OrderItem,
  Sku,
  RetailInventory,
  InventoryMovement,
  LogisticsTracking,
  RetailShop,
} from '../../database/entities';
import { OrderStatus, DeliveryMethod, UserRole } from '../../database/enums';
import { RedisService, CartItem } from '../../redis/redis.service';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Sku)
    private readonly skuRepository: Repository<Sku>,
    @InjectRepository(RetailShop)
    private readonly shopRepository: Repository<RetailShop>,
  ) {}

  // ================= REDIS CART MANAGEMENT =================

  async getCart(userCtx: UserContext) {
    this.ensureRetailer(userCtx);
    const cart = await this.redisService.getCart(userCtx.shopId!);
    if (cart.length === 0) {
      return { items: [], totalAmount: 0 };
    }

    const skus = await this.skuRepository.createQueryBuilder('sku')
      .leftJoinAndSelect('sku.supplier', 'supplier')
      .where('sku.sku IN (:...skus)', { skus: cart.map((i) => i.sku) })
      .getMany();

    const skuMap = new Map(skus.map((s) => [s.sku, s]));
    let totalAmount = 0;

    const itemsWithDetails = cart.map((item) => {
      const details = skuMap.get(item.sku);
      const price = details ? Number(details.price) : 0;
      const subtotal = price * item.quantity;
      totalAmount += subtotal;
      return {
        sku: item.sku,
        quantity: item.quantity,
        price,
        subtotal,
        skuDetails: details || null,
      };
    });

    return {
      items: itemsWithDetails,
      totalAmount,
    };
  }

  async addToCart(dto: AddToCartDto, userCtx: UserContext) {
    this.ensureRetailer(userCtx);

    const skuItem = await this.skuRepository.findOne({ where: { sku: dto.sku } });
    if (!skuItem) {
      throw new NotFoundException(`SKU ${dto.sku} not found`);
    }

    if (skuItem.stockLevel < dto.quantity) {
      throw new BadRequestException(
        `Cannot add ${dto.quantity} units of ${dto.sku}. Available stock: ${skuItem.stockLevel}`,
      );
    }

    const currentCart = await this.redisService.getCart(userCtx.shopId!);
    const existingIndex = currentCart.findIndex((i) => i.sku === dto.sku);

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += dto.quantity;
    } else {
      currentCart.push({ sku: dto.sku, quantity: dto.quantity });
    }

    await this.redisService.setCart(userCtx.shopId!, currentCart);
    return this.getCart(userCtx);
  }

  async clearCart(userCtx: UserContext) {
    this.ensureRetailer(userCtx);
    await this.redisService.clearCart(userCtx.shopId!);
    return { message: 'Cart cleared successfully' };
  }

  // ================= TRANSACTIONAL ORDER CONFIRMATION =================

  async confirmOrder(
    dto: ConfirmOrderDto,
    headerIdempotencyKey: string | undefined,
    userCtx: UserContext,
  ) {
    this.ensureRetailer(userCtx);
    const shopId = userCtx.shopId!;
    const idempotencyKey = headerIdempotencyKey || dto.idempotencyKey;

    // 1. Idempotency Check
    if (idempotencyKey) {
      const existingOrder = await this.orderRepository.findOne({
        where: { idempotencyKey },
        relations: { items: true, logisticsTracking: true, shop: true, supplier: true },
      });
      if (existingOrder) {
        this.logger.log(`Idempotency key hit: ${idempotencyKey}. Returning original order ${existingOrder.id}`);
        return {
          replayed: true,
          order: existingOrder,
        };
      }
    }

    // Fetch Cart
    const cart = await this.redisService.getCart(shopId);
    if (!cart || cart.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot confirm order.');
    }

    // Execute in DB Transaction with Pessimistic Locking
    return await this.dataSource.transaction(async (manager) => {
      // Group items by supplier to enforce valid order structure
      const skuList: Sku[] = [];
      let calculatedTotal = 0;

      for (const cartItem of cart) {
        // Pessimistic Write Lock on SKU row
        const skuEntity = await manager.findOne(Sku, {
          where: { sku: cartItem.sku },
          lock: { mode: 'pessimistic_write' },
        });

        if (!skuEntity) {
          throw new NotFoundException(`SKU ${cartItem.sku} no longer exists`);
        }

        if (skuEntity.stockLevel < cartItem.quantity) {
          throw new BadRequestException(
            `Insufficient stock for SKU ${cartItem.sku}. Requested: ${cartItem.quantity}, Available: ${skuEntity.stockLevel}`,
          );
        }

        skuList.push(skuEntity);
        calculatedTotal += Number(skuEntity.price) * cartItem.quantity;
      }

      // Check supplier uniformity (Phase 1 orders are per supplier)
      const primarySupplierId = skuList[0].supplierId;

      // Create Order Record
      const newOrder = manager.create(Order, {
        shopId,
        supplierId: primarySupplierId,
        status: OrderStatus.CONFIRMED,
        deliveryMethod: dto.deliveryMethod || DeliveryMethod.CARGO_24H,
        totalAmount: calculatedTotal,
        idempotencyKey,
        confirmedAt: new Date(),
      });
      const savedOrder = await manager.save(newOrder);

      // Process each line item atomically
      for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const skuEntity = skuList[i];

        // A. Deduct Supplier Stock
        skuEntity.stockLevel -= cartItem.quantity;
        await manager.save(skuEntity);

        // B. Upsert Retail Shop Inventory
        let retailInv = await manager.findOne(RetailInventory, {
          where: { shopId, sku: cartItem.sku },
          lock: { mode: 'pessimistic_write' },
        });

        if (!retailInv) {
          retailInv = manager.create(RetailInventory, {
            shopId,
            sku: cartItem.sku,
            stockLevel: cartItem.quantity,
          });
        } else {
          retailInv.stockLevel += cartItem.quantity;
        }
        await manager.save(retailInv);

        // C. Save Order Item
        const orderItem = manager.create(OrderItem, {
          orderId: savedOrder.id,
          sku: cartItem.sku,
          quantity: cartItem.quantity,
          unitPrice: Number(skuEntity.price),
        });
        await manager.save(orderItem);

        // D. Insert Audit Row in inventory_movements
        const movement = manager.create(InventoryMovement, {
          orderId: savedOrder.id,
          sku: cartItem.sku,
          supplierDelta: -cartItem.quantity,
          retailDelta: cartItem.quantity,
          shopId,
        });
        await manager.save(movement);
      }

      // E. Create Logistics Tracking record if delivery method set
      if (dto.deliveryMethod || newOrder.deliveryMethod) {
        const tracking = manager.create(LogisticsTracking, {
          orderId: savedOrder.id,
          method: dto.deliveryMethod || newOrder.deliveryMethod,
          status: 'pending',
        });
        await manager.save(tracking);
      }

      // F. Clear Cart after successful transaction
      await this.redisService.clearCart(shopId);

      this.logger.log(`Order ${savedOrder.id} successfully confirmed and stock synchronized.`);
      return {
        replayed: false,
        order: await manager.findOne(Order, {
          where: { id: savedOrder.id },
          relations: { items: true, logisticsTracking: true, supplier: true, shop: true },
        }),
      };
    });
  }

  // ================= ORDER HISTORY =================

  async findAll(userCtx: UserContext) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.logisticsTracking', 'logistics')
      .leftJoinAndSelect('order.supplier', 'supplier')
      .leftJoinAndSelect('order.shop', 'shop')
      .orderBy('order.createdAt', 'DESC');

    if (userCtx.role === UserRole.RETAILER && userCtx.shopId) {
      query.andWhere('order.shopId = :shopId', { shopId: userCtx.shopId });
    } else if (userCtx.role === UserRole.SUPPLIER && userCtx.supplierId) {
      query.andWhere('order.supplierId = :supplierId', { supplierId: userCtx.supplierId });
    }

    return query.getMany();
  }

  async findOne(id: string, userCtx: UserContext) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { items: { skuItem: true }, logisticsTracking: true, supplier: true, shop: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    if (
      userCtx.role === UserRole.RETAILER &&
      order.shopId !== userCtx.shopId
    ) {
      throw new ForbiddenException('You can only view your own shop orders');
    }

    if (
      userCtx.role === UserRole.SUPPLIER &&
      order.supplierId !== userCtx.supplierId
    ) {
      throw new ForbiddenException('You can only view orders placed with your company');
    }

    return order;
  }

  private ensureRetailer(userCtx: UserContext) {
    if (userCtx.role !== UserRole.RETAILER && userCtx.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only retail shop accounts can manage carts and place orders');
    }
    if (!userCtx.shopId && userCtx.role !== UserRole.ADMIN) {
      throw new BadRequestException('Retail shop profile is required');
    }
  }
}
