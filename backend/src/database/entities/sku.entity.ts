import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { SkuType } from '../enums';
import { Supplier } from './supplier.entity';

@Entity('skus')
@Index('idx_skus_optical_matrix', ['supplierId', 'sph', 'cyl', 'axis'])
@Index('idx_skus_low_stock', ['supplierId', 'stockLevel'])
@Check('chk_skus_stock_level', 'stock_level >= 0')
@Check('chk_skus_axis', 'axis IS NULL OR (axis >= 1 AND axis <= 180)')
export class Sku {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  sku: string;

  @Column({ type: 'uuid', name: 'supplier_id' })
  supplierId: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.skus)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'enum', enum: SkuType })
  type: SkuType;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'integer', default: 0, name: 'stock_level' })
  stockLevel: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  sph: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  cyl: number;

  @Column({ type: 'smallint', nullable: true })
  axis: number;

  @Column({ type: 'integer', default: 20, name: 'low_stock_threshold' })
  lowStockThreshold: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
