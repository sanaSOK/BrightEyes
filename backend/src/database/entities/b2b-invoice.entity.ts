import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { PaymentTerms } from '../enums';
import { Order } from './order.entity';
import { Supplier } from './supplier.entity';
import { RetailShop } from './retail-shop.entity';

@Entity('b2b_invoices')
export class B2bInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'uuid', name: 'supplier_id' })
  supplierId: string;

  @ManyToOne(() => Supplier, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'uuid', name: 'shop_id' })
  shopId: string;

  @ManyToOne(() => RetailShop, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'shop_id' })
  shop: RetailShop;

  @Column({
    type: 'enum',
    enum: PaymentTerms,
    default: PaymentTerms.IMMEDIATE,
    name: 'payment_terms',
  })
  paymentTerms: PaymentTerms;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.0, name: 'delivery_fee' })
  deliveryFee: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 10.0, name: 'vat_rate' })
  vatRate: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.0, name: 'vat_amount' })
  vatAmount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'issued_at' })
  issuedAt: Date;
}
