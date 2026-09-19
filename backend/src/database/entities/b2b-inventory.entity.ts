import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { LensVariant } from './lens-variant.entity';

@Entity('b2b_inventory')
@Index('idx_b2b_supplier_variant', ['supplierId', 'lensVariantId'])
export class B2bInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'supplier_id' })
  supplierId: string;

  @ManyToOne(() => Supplier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'uuid', name: 'lens_variant_id', nullable: true })
  lensVariantId: string;

  @ManyToOne(() => LensVariant, (variant) => variant.b2bInventories, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lens_variant_id' })
  lensVariant: LensVariant;

  @Column({ type: 'integer', default: 0, name: 'stock_qty' })
  stockQty: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'wholesale_price' })
  wholesalePrice: number;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
