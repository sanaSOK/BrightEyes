import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Sku } from './sku.entity';
import { RetailShop } from './retail-shop.entity';

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true, name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.inventoryMovements, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'varchar', length: 50 })
  sku: string;

  @ManyToOne(() => Sku)
  @JoinColumn({ name: 'sku' })
  skuItem: Sku;

  @Column({ type: 'integer', name: 'supplier_delta' })
  supplierDelta: number;

  @Column({ type: 'integer', name: 'retail_delta' })
  retailDelta: number;

  @Column({ type: 'uuid', nullable: true, name: 'shop_id' })
  shopId: string;

  @ManyToOne(() => RetailShop, (shop) => shop.inventoryMovements, {
    nullable: true,
  })
  @JoinColumn({ name: 'shop_id' })
  shop: RetailShop;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
