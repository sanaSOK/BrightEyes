import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetailShopsService } from './retail-shops.service';
import { RetailShopsController } from './retail-shops.controller';
import { RetailShop } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RetailShop])],
  controllers: [RetailShopsController],
  providers: [RetailShopsService],
  exports: [RetailShopsService],
})
export class RetailShopsModule {}
