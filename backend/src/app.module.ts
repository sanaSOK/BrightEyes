import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { RetailShopsModule } from './modules/retail-shops/retail-shops.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { RetailInventoryModule } from './modules/retail-inventory/retail-inventory.module';
import { OrdersModule } from './modules/orders/orders.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { LensMatrixModule } from './modules/lens-matrix/lens-matrix.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { JobCardsModule } from './modules/job-cards/job-cards.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OtpModule } from './modules/otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
    SuppliersModule,
    RetailShopsModule,
    InventoryModule,
    RetailInventoryModule,
    OrdersModule,
    LogisticsModule,
    LensMatrixModule,
    PrescriptionsModule,
    JobCardsModule,
    PaymentsModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
