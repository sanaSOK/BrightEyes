import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus, DeliveryMethod } from '../enums';
import { RetailShop } from './retail-shop.entity';
import { Supplier } from './supplier.entity';
import { OrderItem } from './order-item.entity';
import { LogisticsTracking } from './logistics-tracking.entity';
import { InventoryMovement } from './inventory-movement.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'shop_id' })
  shopId: string;

  @ManyToOne(() => RetailShop, (shop) => shop.orders)
  @JoinColumn({ name: 'shop_id' })
  shop: RetailShop;

  @Column({ type: 'uuid', name: 'supplier_id' })
  supplierId: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.orders)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: DeliveryMethod,
    nullable: true,
    name: 'delivery_method',
  })
  deliveryMethod: DeliveryMethod;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
    name: 'idempotency_key',
  })
  idempotencyKey: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'confirmed_at' })
  confirmedAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToOne(() => LogisticsTracking, (tracking) => tracking.order)
  logisticsTracking: LogisticsTracking;

  @OneToMany(() => InventoryMovement, (movement) => movement.order)
  inventoryMovements: InventoryMovement[];
}
