import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { LensProduct } from './lens-product.entity';
import { B2bInventory } from './b2b-inventory.entity';
import { RetailInventory } from './retail-inventory.entity';

@Entity('lens_variants')
@Index('idx_lens_matrix', ['lensProductId', 'sph', 'cyl'])
export class LensVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'lens_product_id' })
  lensProductId: string;

  @ManyToOne(() => LensProduct, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lens_product_id' })
  lensProduct: LensProduct;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'numeric', precision: 4, scale: 2 })
  sph: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, default: 0.0 })
  cyl: number;

  @Column({ type: 'integer', nullable: true })
  axis: number;

  @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true, name: 'add_power' })
  addPower: number;

  @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true, name: 'base_curve' })
  baseCurve: number;

  @Column({ type: 'numeric', precision: 4, scale: 1, nullable: true })
  diameter: number;

  @OneToMany(() => B2bInventory, (b2b) => b2b.lensVariant)
  b2bInventories: B2bInventory[];

  @OneToMany(() => RetailInventory, (retail) => retail.lensVariant)
  retailInventories: RetailInventory[];
}
