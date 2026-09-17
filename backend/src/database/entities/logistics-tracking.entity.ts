import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { DeliveryMethod } from '../enums';
import { Order } from './order.entity';

@Entity('logistics_tracking')
export class LogisticsTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true, name: 'order_id' })
  orderId: string;

  @OneToOne(() => Order, (order) => order.logisticsTracking)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'enum', enum: DeliveryMethod })
  method: DeliveryMethod;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'provider_ref',
  })
  providerRef: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'estimated_arrival' })
  estimatedArrival: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
