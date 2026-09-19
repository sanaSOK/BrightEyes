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
  B2bInvoice,
  LensVariant,
  B2bInventory,
} from '../../database/entities';
import { OrderStatus, DeliveryMethod, UserRole, PaymentTerms } from '../../database/enums';
import { RedisService } from '../../redis/redis.service';
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
    @InjectRepository(B2bInvoice)
    private readonly invoiceRepository: Repository<B2bInvoice>,
  ) {}

  // ================= REDIS CART MANAGEMENT =================

  async getCart(userCtx: UserContext) {
    this.ensureRetailer(userCtx);
    const cart = await this.redisService.getCart(userCtx.shopId!);
    if (cart.length === 0) {
      return { items: [], subtotal: 0 };
    }

    const skus = await this.skuRepository
      .createQueryBuilder('sku')
      .leftJoinAndSelect('sku.supplier', 'supplier')
      .where('sku.sku IN (:...skus)', { skus: cart.map((i) => i.sku) })
      .getMany();

    const skuMap = new Map(skus.map((s) => [s.sku, s]));
    let subtotal = 0;

    const itemsWithDetails = cart.map((item) => {
      const details = skuMap.get(item.sku);
      const price = details ? Number(details.price) : 0;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;
      return {
        sku: item.sku,
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal,
        skuDetails: details || null,
      };
    });

    return {
      items: itemsWithDetails,
      subtotal,
    };
  }

  async addToCart(dto: AddToCartDto, userCtx: UserContext) {
    this.ensureRetailer(userCtx);

    const skuItem = await this.skuRepository.findOne({ where: { sku: dto.sku } });
    if (!skuItem) {
      throw new NotFoundException(`SKU ${dto.sku} not found in catalog`);
    }

    // Stock Validation TC-04
    if (skuItem.stockLevel < dto.quantity) {
      throw new BadRequestException(
        `Insufficient Stock: Cannot add ${dto.quantity} units of ${dto.sku}. Available stock: ${skuItem.stockLevel}`,
      );
    }

    const currentCart = await this.redisService.getCart(userCtx.shopId!);
    const existingIndex = currentCart.findIndex((i) => i.sku === dto.sku);

    if (existingIndex > -1) {
      const totalRequested = currentCart[existingIndex].quantity + dto.quantity;
      if (skuItem.stockLevel < totalRequested) {
        throw new BadRequestException(
          `Insufficient Stock: Total requested quantity (${totalRequested}) exceeds available supplier stock (${skuItem.stockLevel}).`,
        );
      }
      currentCart[existingIndex].quantity = totalRequested;
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

  // ================= TRANSACTIONAL ORDER CONFIRMATION & INVOICING =================

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
        const invoice = await this.invoiceRepository.findOne({ where: { orderId: existingOrder.id } });
        this.logger.log(`Idempotency key hit: ${idempotencyKey}. Returning existing order ${existingOrder.id}`);
        return {
          replayed: true,
          order: existingOrder,
          invoice: invoice || null,
        };
      }
    }

    // Fetch Cart
    const cart = await this.redisService.getCart(shopId);
    if (!cart || cart.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot confirm order.');
    }

    const deliveryMethod = dto.deliveryMethod || DeliveryMethod.CARGO_24H;
    const paymentTerms = dto.paymentTerms || PaymentTerms.IMMEDIATE;

    // Tiered Logistics Fee Calculation
    let deliveryFee = 5.0; // Default CARGO_24H: $5.00
    if (deliveryMethod === DeliveryMethod.EXPRESS_MOTO) {
      deliveryFee = 3.0; // Express Motorbike (GrabExpress): $3.00
    } else if (deliveryMethod === DeliveryMethod.SELF_PICKUP) {
      deliveryFee = 0.0; // Warehouse self-pickup: free
    }

    // Execute in Database Transaction (BEGIN...COMMIT) with Pessimistic Write Locks
    return await this.dataSource.transaction(async (manager) => {
      const skuList: Sku[] = [];
      let subtotal = 0;

      for (const cartItem of cart) {
        // Pessimistic Write Lock on SKU row
        const skuEntity = await manager.findOne(Sku, {
          where: { sku: cartItem.sku },
          lock: { mode: 'pessimistic_write' },
        });

        if (!skuEntity) {
          throw new NotFoundException(`SKU ${cartItem.sku} no longer exists`);
        }

        // Real-Time Stock Validation (TC-04: Block order if quantity exceeds stock)
        if (skuEntity.stockLevel < cartItem.quantity) {
          throw new BadRequestException(
            `Insufficient Stock: Order request for SKU ${cartItem.sku} (${cartItem.quantity} units) exceeds available supplier stock (${skuEntity.stockLevel}).`,
          );
        }

        skuList.push(skuEntity);
        subtotal += Number(skuEntity.price) * cartItem.quantity;
      }

      const primarySupplierId = skuList[0].supplierId;

      // Calculate 10% VAT
      const vatRate = 10.0;
      const vatAmount = Math.round(subtotal * 0.1 * 100) / 100;
      const totalAmount = Math.round((subtotal + deliveryFee + vatAmount) * 100) / 100;

      // 1. Create Order Record
      const newOrder = manager.create(Order, {
        shopId,
        supplierId: primarySupplierId,
        status: OrderStatus.CONFIRMED,
        deliveryMethod,
        totalAmount,
        idempotencyKey,
        confirmedAt: new Date(),
      });
      const savedOrder = await manager.save(newOrder);

      // 2. Process each line item atomically (TC-06 & TC-07)
      for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const skuEntity = skuList[i];

        // TC-06: Deduct Supplier Stock
        skuEntity.stockLevel -= cartItem.quantity;
        await manager.save(skuEntity);

        // Also update b2b_inventory if matching lens variant exists
        const lensVariant = await manager.findOne(LensVariant, { where: { sku: cartItem.sku } });
        if (lensVariant) {
          const b2bInv = await manager.findOne(B2bInventory, {
            where: { supplierId: primarySupplierId, lensVariantId: lensVariant.id },
            lock: { mode: 'pessimistic_write' },
          });
          if (b2bInv) {
            b2bInv.stockQty = Math.max(0, b2bInv.stockQty - cartItem.quantity);
            await manager.save(b2bInv);
          }
        }

        // TC-07: Upsert & Inject Retail Store Inventory
        let retailInv = await manager.findOne(RetailInventory, {
          where: { shopId, sku: cartItem.sku },
          lock: { mode: 'pessimistic_write' },
        });

        if (!retailInv) {
          retailInv = manager.create(RetailInventory, {
            shopId,
            sku: cartItem.sku,
            lensVariantId: lensVariant ? lensVariant.id : undefined,
            stockQty: cartItem.quantity,
            retailPrice: Number(skuEntity.price) * 1.25, // Default markup for retail
            lowStockAlert: 2,
          });
        } else {
          retailInv.stockQty += cartItem.quantity;
          if (lensVariant && !retailInv.lensVariantId) {
            retailInv.lensVariantId = lensVariant.id;
          }
        }
        await manager.save(retailInv);

        // Save Order Item
        const orderItem = manager.create(OrderItem, {
          orderId: savedOrder.id,
          sku: cartItem.sku,
          quantity: cartItem.quantity,
          unitPrice: Number(skuEntity.price),
        });
        await manager.save(orderItem);

        // Insert Audit Row in inventory_movements
        const movement = manager.create(InventoryMovement, {
          orderId: savedOrder.id,
          sku: cartItem.sku,
          supplierDelta: -cartItem.quantity,
          retailDelta: cartItem.quantity,
          shopId,
        });
        await manager.save(movement);
      }

      // 3. Automated Invoicing Generation (TC-08)
      const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        100000 + Math.random() * 900000,
      )}`;

      const invoice = manager.create(B2bInvoice, {
        invoiceNumber,
        orderId: savedOrder.id,
        supplierId: primarySupplierId,
        shopId,
        paymentTerms,
        subtotal,
        deliveryFee,
        vatRate,
        vatAmount,
        totalAmount,
      });
      const savedInvoice = await manager.save(invoice);

      // 4. Create Logistics Tracking
      const tracking = manager.create(LogisticsTracking, {
        orderId: savedOrder.id,
        method: deliveryMethod,
        status: 'pending',
      });
      await manager.save(tracking);

      // Clear Cart after successful transaction
      await this.redisService.clearCart(shopId);

      this.logger.log(`Order ${savedOrder.id} confirmed and B2B Invoice ${savedInvoice.invoiceNumber} generated.`);

      return {
        replayed: false,
        order: await manager.findOne(Order, {
          where: { id: savedOrder.id },
          relations: { items: true, logisticsTracking: true, supplier: true, shop: true },
        }),
        invoice: savedInvoice,
      };
    });
  }

  // ================= ORDER HISTORY & INVOICES =================

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

    if (userCtx.role === UserRole.RETAILER && order.shopId !== userCtx.shopId) {
      throw new ForbiddenException('You can only view your own shop orders');
    }

    if (userCtx.role === UserRole.SUPPLIER && order.supplierId !== userCtx.supplierId) {
      throw new ForbiddenException('You can only view orders placed with your company');
    }

    const invoice = await this.invoiceRepository.findOne({ where: { orderId: id } });

    return {
      order,
      invoice: invoice || null,
    };
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
