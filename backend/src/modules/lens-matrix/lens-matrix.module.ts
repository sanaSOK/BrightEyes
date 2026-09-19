import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LensProduct, LensVariant, B2bInventory } from '../../database/entities';
import { LensMatrixService } from './lens-matrix.service';
import { LensMatrixController } from './lens-matrix.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LensProduct, LensVariant, B2bInventory])],
  controllers: [LensMatrixController],
  providers: [LensMatrixService],
  exports: [LensMatrixService],
})
export class LensMatrixModule {}
