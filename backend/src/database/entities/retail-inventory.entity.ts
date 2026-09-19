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
import { LensVariant } from './lens-variant.entity';

@Entity('retail_inventory')
@Index('idx_retail_sync', ['shopId', 'lensVariantId'])
@Index('idx_retail_shop_sku', ['shopId', 'sku'])
@Check('chk_retail_inventory_stock_qty', 'stock_qty >= 0')
export class RetailInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'shop_id' })
  shopId: string;

  @ManyToOne(() => RetailShop, (shop) => shop.inventories)
  @JoinColumn({ name: 'shop_id' })
  shop: RetailShop;

  @Column({ type: 'uuid', name: 'lens_variant_id', nullable: true })
  lensVariantId: string;

  @ManyToOne(() => LensVariant, (variant) => variant.retailInventories, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lens_variant_id' })
  lensVariant: LensVariant;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @ManyToOne(() => Sku, { nullable: true })
  @JoinColumn({ name: 'sku' })
  skuItem: Sku;

  @Column({ type: 'integer', default: 0, name: 'stock_qty' })
  stockQty: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.0, name: 'retail_price' })
  retailPrice: number;

  @Column({ type: 'integer', default: 2, name: 'low_stock_alert' })
  lowStockAlert: number;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
