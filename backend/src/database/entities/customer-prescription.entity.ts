import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { RetailShop } from './retail-shop.entity';

@Entity('customer_prescriptions')
export class CustomerPrescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ type: 'uuid', nullable: true, name: 'store_id' })
  storeId: string;

  @ManyToOne(() => RetailShop, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'store_id' })
  store: RetailShop;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'checked_by' })
  checkedBy: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'check_date' })
  checkDate: string;

  // Oculus Dexter (OD) - Right Eye
  @Column({ type: 'numeric', precision: 4, scale: 2, name: 'od_sph' })
  odSph: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, default: 0.0, name: 'od_cyl' })
  odCyl: number;

  @Column({ type: 'integer', nullable: true, name: 'od_axis' })
  odAxis: number;

  @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true, name: 'od_add' })
  odAdd: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true, name: 'od_pd' })
  odPd: number;

  // Oculus Sinister (OS) - Left Eye
  @Column({ type: 'numeric', precision: 4, scale: 2, name: 'os_sph' })
  osSph: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, default: 0.0, name: 'os_cyl' })
  osCyl: number;

  @Column({ type: 'integer', nullable: true, name: 'os_axis' })
  osAxis: number;

  @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true, name: 'os_add' })
  osAdd: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true, name: 'os_pd' })
  osPd: number;

  @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true, name: 'base_curve' })
  baseCurve: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
