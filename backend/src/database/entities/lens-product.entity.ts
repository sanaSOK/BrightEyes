import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { LensVariant } from './lens-variant.entity';

@Entity('lens_products')
export class LensProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'brand_name' })
  brandName: string;

  @Column({ type: 'varchar', length: 50, name: 'lens_type' })
  lensType: string;

  @Column({ type: 'varchar', length: 50, name: 'lens_material' })
  lensMaterial: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  coating: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => LensVariant, (variant) => variant.lensProduct)
  variants: LensVariant[];
}
