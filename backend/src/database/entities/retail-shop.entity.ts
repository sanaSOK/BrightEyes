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
import { RetailInventory } from './retail-inventory.entity';
import { Order } from './order.entity';
import { InventoryMovement } from './inventory-movement.entity';

@Entity('retail_shops')
export class RetailShop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.retailShop)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255, name: 'shop_name' })
  shopName: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  province: string;

  @Column({ type: 'numeric', precision: 9, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', precision: 9, scale: 6, nullable: true })
  longitude: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => RetailInventory, (inventory) => inventory.shop)
  inventories: RetailInventory[];

  @OneToMany(() => Order, (order) => order.shop)
  orders: Order[];

  @OneToMany(() => InventoryMovement, (movement) => movement.shop)
  inventoryMovements: InventoryMovement[];
}
