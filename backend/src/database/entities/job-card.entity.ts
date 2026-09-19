import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobCardStatus } from '../enums';
import { RetailShop } from './retail-shop.entity';
import { CustomerPrescription } from './customer-prescription.entity';
import { Order } from './order.entity';

@Entity('job_cards')
export class JobCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'shop_id' })
  shopId: string;

  @ManyToOne(() => RetailShop, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: RetailShop;

  @Column({ type: 'uuid', nullable: true, name: 'prescription_id' })
  prescriptionId: string;

  @ManyToOne(() => CustomerPrescription, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'prescription_id' })
  prescription: CustomerPrescription;

  @Column({ type: 'uuid', nullable: true, name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    type: 'enum',
    enum: JobCardStatus,
    default: JobCardStatus.RECEIVED,
  })
  status: JobCardStatus;

  @Column({ type: 'text', nullable: true, name: 'lens_details' })
  lensDetails: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
