# BrightEyes B2B Optical Wholesale Ordering Platform (Phase 1)

Welcome to the backend API service for **BrightEyes** — Cambodia's B2B optical industry wholesale platform.

---

## Key Features

- **JWT Authentication & Role-Based Access Control**:
  - Distinct accounts for **Suppliers**, **Retail Shops**, and **Admins**.
  - Role guards (`@Roles(...)`) and resource scoping ensuring retailers can only access their shop data and suppliers can only manage their catalog.

- **Live Optical Matrix Catalog Search**:
  - `GET /api/v1/inventory/catalog` with query filters for `type` (`lens`, `frame`, `accessory`), `minSph`, `maxSph`, `minCyl`, `maxCyl`, `minAxis`, `maxAxis`, `inStockOnly`, and pagination.
  - Optimized composite indexes (`idx_skus_optical_matrix` & `idx_skus_low_stock`).

- **Redis-Backed Cart Session Management**:
  - Shopping cart storage keyed by shop (`cart:<shopId>`) with automatic in-memory fallback.

- **Transactional Stock Sync Engine (`confirmOrder`)**:
  - Single database transaction (`DataSource.transaction()`) with **Pessimistic Write Locking** (`pessimistic_write`) on `Sku` rows to prevent race conditions and overselling.
  - Deducts supplier stock, upserts retail inventory (`retail_inventory`), records audit logs in `inventory_movements`, and supports `Idempotency-Key` header replay prevention.

- **Logistics & Delivery Tracking**:
  - Attach delivery methods (`cargo_24h`, `express_moto`, `self_pickup`) and query delivery status via `GET /api/v1/logistics/:orderId`.

- **Auto-Generated Swagger API Documentation**:
  - Interactive OpenAPI UI at `http://localhost:3001/api/docs`.

---

## Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default `.env` configuration:

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=brighteyes_db
DB_SYNC=true
DB_LOGGING=false

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=super_secret_jwt_key_brighteyes
JWT_EXPIRES_IN=7d
```

---

## Running with Docker Compose

Start PostgreSQL 16 and Redis 7 in detached mode:

```bash
docker-compose up -d
```

---

## Database Migrations & Seeding

Run TypeORM migrations:

```bash
npm run migration:run
```

Seed the database with demo users, supplier company, retail shop, and optical lens catalog SKUs:

```bash
npm run seed
```

---

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Build & Execution
```bash
npm run build
npm run start:prod
```

---

## API Documentation

Once the app is running, open your browser to access the Swagger documentation:

👉 **[http://localhost:3001/api/docs](http://localhost:3001/api/docs)**

### Pre-seeded Credentials for Testing

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@brighteyes.com` | `Secret123!` | Full platform access |
| **Supplier** | `supplier@brighteyes.com` | `Secret123!` | Phnom Penh Optical Wholesale Co., Ltd. |
| **Retailer** | `retailer@brighteyes.com` | `Secret123!` | Central Optical Phnom Penh |
