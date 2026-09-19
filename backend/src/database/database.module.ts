import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Supplier,
  RetailShop,
  Sku,
  LensProduct,
  LensVariant,
  B2bInventory,
  RetailInventory,
  CustomerPrescription,
  JobCard,
  Order,
  OrderItem,
  B2bInvoice,
  KhqrPayment,
  OtpVerification,
  InventoryMovement,
  LogisticsTracking,
} from './entities';

const entities = [
  User,
  Supplier,
  RetailShop,
  Sku,
  LensProduct,
  LensVariant,
  B2bInventory,
  RetailInventory,
  CustomerPrescription,
  JobCard,
  Order,
  OrderItem,
  B2bInvoice,
  KhqrPayment,
  OtpVerification,
  InventoryMovement,
  LogisticsTracking,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'brighteyes_db'),
        entities: entities,
        synchronize: configService.get<boolean>('DB_SYNC', true),
        logging: configService.get<boolean>('DB_LOGGING', false),
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
