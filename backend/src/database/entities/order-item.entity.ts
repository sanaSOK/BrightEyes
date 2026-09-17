import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Order } from './order.entity';
import { Sku } from './sku.entity';

@Entity('order_items')
@Check('chk_order_items_quantity', 'quantity > 0')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'varchar', length: 50 })
  sku: string;

  @ManyToOne(() => Sku)
  @JoinColumn({ name: 'sku' })
  skuItem: Sku;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'unit_price' })
  unitPrice: number;
}
