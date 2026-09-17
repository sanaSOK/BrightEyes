import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1726300000000 implements MigrationInterface {
  name = 'InitialSchema1726300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Enums
    await queryRunner.query(`
      CREATE TYPE "user_role" AS ENUM ('supplier', 'retailer', 'admin');
      CREATE TYPE "sku_type" AS ENUM ('lens', 'frame', 'accessory');
      CREATE TYPE "order_status" AS ENUM ('pending', 'confirmed', 'processing', 'in_transit', 'delivered', 'cancelled');
      CREATE TYPE "delivery_method" AS ENUM ('cargo_24h', 'express_moto', 'self_pickup');
    `);

    // 2. Extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 3. Table: users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" varchar(255) NOT NULL UNIQUE,
        "phone" varchar(20),
        "password_hash" text NOT NULL,
        "role" "user_role" NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      );
    `);

    // 4. Table: suppliers
    await queryRunner.query(`
      CREATE TABLE "suppliers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "company_name" varchar(255) NOT NULL,
        "tax_id" varchar(100),
        "address" text,
        "province" varchar(100),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_suppliers_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_suppliers_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 5. Table: retail_shops
    await queryRunner.query(`
      CREATE TABLE "retail_shops" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "shop_name" varchar(255) NOT NULL,
        "address" text,
        "province" varchar(100),
        "latitude" numeric(9,6),
        "longitude" numeric(9,6),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_retail_shops_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_retail_shops_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 6. Table: skus
    await queryRunner.query(`
      CREATE TABLE "skus" (
        "sku" varchar(50) NOT NULL,
        "supplier_id" uuid NOT NULL,
        "type" "sku_type" NOT NULL,
        "description" varchar(255) NOT NULL,
        "price" numeric(12,2) NOT NULL,
        "stock_level" integer NOT NULL DEFAULT 0,
        "sph" numeric(4,2),
        "cyl" numeric(4,2),
        "axis" smallint,
        "low_stock_threshold" integer NOT NULL DEFAULT 20,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_skus_sku" PRIMARY KEY ("sku"),
        CONSTRAINT "FK_skus_supplier_id" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE,
        CONSTRAINT "chk_skus_stock_level" CHECK (stock_level >= 0),
        CONSTRAINT "chk_skus_axis" CHECK (axis IS NULL OR (axis >= 1 AND axis <= 180))
      );
    `);

    // Indexes on skus
    await queryRunner.query(`
      CREATE INDEX "idx_skus_optical_matrix" ON "skus" ("supplier_id", "sph", "cyl", "axis");
      CREATE INDEX "idx_skus_low_stock" ON "skus" ("supplier_id", "stock_level");
    `);

    // 7. Table: retail_inventory
    await queryRunner.query(`
      CREATE TABLE "retail_inventory" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "shop_id" uuid NOT NULL,
        "sku" varchar(50) NOT NULL,
        "stock_level" integer NOT NULL DEFAULT 0,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_retail_inventory_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_retail_inventory_shop_id" FOREIGN KEY ("shop_id") REFERENCES "retail_shops"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_retail_inventory_sku" FOREIGN KEY ("sku") REFERENCES "skus"("sku") ON DELETE CASCADE,
        CONSTRAINT "UQ_retail_inventory_shop_sku" UNIQUE ("shop_id", "sku"),
        CONSTRAINT "chk_retail_inventory_stock_level" CHECK (stock_level >= 0)
      );
    `);

    // 8. Table: orders
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "shop_id" uuid NOT NULL,
        "supplier_id" uuid NOT NULL,
        "status" "order_status" NOT NULL DEFAULT 'pending',
        "delivery_method" "delivery_method",
        "total_amount" numeric(12,2) NOT NULL,
        "idempotency_key" varchar(100) UNIQUE,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "confirmed_at" TIMESTAMPTZ,
        CONSTRAINT "PK_orders_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_shop_id" FOREIGN KEY ("shop_id") REFERENCES "retail_shops"("id"),
        CONSTRAINT "FK_orders_supplier_id" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id")
      );
    `);

    // 9. Table: order_items
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "sku" varchar(50) NOT NULL,
        "quantity" integer NOT NULL,
        "unit_price" numeric(12,2) NOT NULL,
        CONSTRAINT "PK_order_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_order_items_sku" FOREIGN KEY ("sku") REFERENCES "skus"("sku"),
        CONSTRAINT "chk_order_items_quantity" CHECK (quantity > 0)
      );
    `);

    // 10. Table: inventory_movements
    await queryRunner.query(`
      CREATE TABLE "inventory_movements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid,
        "sku" varchar(50) NOT NULL,
        "supplier_delta" integer NOT NULL,
        "retail_delta" integer NOT NULL,
        "shop_id" uuid,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_movements_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_movements_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_inventory_movements_sku" FOREIGN KEY ("sku") REFERENCES "skus"("sku"),
        CONSTRAINT "FK_inventory_movements_shop_id" FOREIGN KEY ("shop_id") REFERENCES "retail_shops"("id") ON DELETE SET NULL
      );
    `);

    // 11. Table: logistics_tracking
    await queryRunner.query(`
      CREATE TABLE "logistics_tracking" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL UNIQUE,
        "method" "delivery_method" NOT NULL,
        "provider_ref" varchar(100),
        "status" varchar(50) DEFAULT 'pending',
        "estimated_arrival" TIMESTAMPTZ,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_logistics_tracking_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_logistics_tracking_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "logistics_tracking";`);
    await queryRunner.query(`DROP TABLE "inventory_movements";`);
    await queryRunner.query(`DROP TABLE "order_items";`);
    await queryRunner.query(`DROP TABLE "orders";`);
    await queryRunner.query(`DROP TABLE "retail_inventory";`);
    await queryRunner.query(`DROP TABLE "skus";`);
    await queryRunner.query(`DROP TABLE "retail_shops";`);
    await queryRunner.query(`DROP TABLE "suppliers";`);
    await queryRunner.query(`DROP TABLE "users";`);
    await queryRunner.query(`DROP TYPE "delivery_method";`);
    await queryRunner.query(`DROP TYPE "order_status";`);
    await queryRunner.query(`DROP TYPE "sku_type";`);
    await queryRunner.query(`DROP TYPE "user_role";`);
  }
}
