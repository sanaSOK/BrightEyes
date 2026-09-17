import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {
  Order,
  OrderItem,
  Sku,
  RetailInventory,
  InventoryMovement,
  LogisticsTracking,
  RetailShop,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Sku,
      RetailInventory,
      InventoryMovement,
      LogisticsTracking,
      RetailShop,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
