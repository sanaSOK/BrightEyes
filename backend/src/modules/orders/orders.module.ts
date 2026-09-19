import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {
  Order,
  OrderItem,
  Sku,
  LensVariant,
  B2bInventory,
  RetailInventory,
  InventoryMovement,
  LogisticsTracking,
  RetailShop,
  B2bInvoice,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Sku,
      LensVariant,
      B2bInventory,
      RetailInventory,
      InventoryMovement,
      LogisticsTracking,
      RetailShop,
      B2bInvoice,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
