import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Sku } from './sku.entity';
import { Order } from './order.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.supplier)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255, name: 'company_name' })
  companyName: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'tax_id' })
  taxId: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  province: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Sku, (sku) => sku.supplier)
  skus: Sku[];

  @OneToMany(() => Order, (order) => order.supplier)
  orders: Order[];
}
