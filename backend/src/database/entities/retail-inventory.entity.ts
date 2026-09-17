import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { RetailShop } from './retail-shop.entity';
import { Sku } from './sku.entity';

@Entity('retail_inventory')
@Index(['shopId', 'sku'], { unique: true })
@Check('chk_retail_inventory_stock_level', 'stock_level >= 0')
export class RetailInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'shop_id' })
  shopId: string;

  @ManyToOne(() => RetailShop, (shop) => shop.inventories)
  @JoinColumn({ name: 'shop_id' })
  shop: RetailShop;

  @Column({ type: 'varchar', length: 50 })
  sku: string;

  @ManyToOne(() => Sku)
  @JoinColumn({ name: 'sku' })
  skuItem: Sku;

  @Column({ type: 'integer', default: 0, name: 'stock_level' })
  stockLevel: number;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
