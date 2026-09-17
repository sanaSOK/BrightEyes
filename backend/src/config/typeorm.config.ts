import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import {
  User,
  Supplier,
  RetailShop,
  Sku,
  RetailInventory,
  Order,
  OrderItem,
  InventoryMovement,
  LogisticsTracking,
} from '../database/entities';

config();

export const typeOrmConfigOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'brighteyes_db',
  entities: [
    User,
    Supplier,
    RetailShop,
    Sku,
    RetailInventory,
    Order,
    OrderItem,
    InventoryMovement,
    LogisticsTracking,
  ],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',
};

const dataSource = new DataSource(typeOrmConfigOptions);
export default dataSource;
