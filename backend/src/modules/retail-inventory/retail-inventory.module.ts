import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetailInventoryService } from './retail-inventory.service';
import { RetailInventoryController } from './retail-inventory.controller';
import { RetailInventory } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RetailInventory])],
  controllers: [RetailInventoryController],
  providers: [RetailInventoryService],
  exports: [RetailInventoryService],
})
export class RetailInventoryModule {}
