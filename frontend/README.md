# B2B Optics Wholesale Marketplace (Frontend)

A modern, scalable B2B e-commerce web platform frontend built for wholesale optical stock: eyeglass frames (acetate, titanium, TR90), optical lenses (CR-39, high index 1.61/1.67/1.74), optical components (OBE spring hinges, titanium nose pads, screws), and eyewear cases/packaging.

---

## Architecture Overview

```
+-------------------------------------------------------------------+
|                        UI Components / Pages                      |
| (Dumb presentational components & thin Next.js route pages)      |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                           Feature Hooks                           |
| (React Query useProducts / useProduct & Zustand stores useCart)   |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                         Feature Services                          |
| (productService, rfqService - Only layer with endpoint URLs)      |
| + Zod Runtime Schema Validation & DTO -> Domain Mappers           |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                           httpClient                              |
| (Fetch wrapper: base URL, auth token header, timeout, error norm) |
+-------------------------------------------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v (NEXT_PUBLIC_USE_MOCKS=true)             v (NEXT_PUBLIC_USE_MOCKS=false)
+------------------------+                 +------------------------+
|      MSW Interceptor   |                 |    Real Backend API    |
| (Browser worker / Node)|                 | (NEXT_PUBLIC_API_URL)  |
+------------------------+                 +------------------------+
```

---

## Tech Stack & Architecture Highlights

- **Framework:** Next.js 14 App Router + TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui primitives
- **Server State:** TanStack Query (React Query v5)
- **Client State:** Zustand with `persist` middleware (Cart, RFQs, Auth, Orders)
- **Runtime Validation:** Zod schemas for all network DTO responses
- **Mocking System:** Mock Service Worker (MSW v2) shared across development server, Vitest unit/component tests, and Playwright E2E tests
- **Testing:** Vitest + React Testing Library (Unit & Component), Playwright (E2E), Storybook 8

---

## Folder Structure

```
src/
├── app/                  # Route thin pages composing feature components
│   ├── (shop)/
│   │   ├── products/     # Catalog listing with dynamic attribute filtering & grid/list toggle
│   │   ├── products/[slug]/ # Product detail with gallery, variants & volume tier pricing
│   │   ├── cart/         # Cart with MOQ & step enforcement + tier price recalculation
│   │   └── checkout/     # B2B purchase order checkout
│   ├── (account)/
│   │   ├── rfq/          # RFQ submission & tracking dashboard
│   │   ├── orders/       # Order history & status
│   │   └── dashboard/    # Company account profile & verification status toggle demo
│   └── (auth)/
│       ├── login/        # Sign in page
│       └── register/     # B2B business registration form
├── components/
│   ├── ui/               # Primitives (Button, Input, Badge, Modal, Skeleton)
│   ├── layout/           # Header, Footer, Sidebar, PageContainer
│   └── shared/           # PriceTag, QuantityInput, EmptyState, ErrorState, Pagination
├── features/
│   ├── products/         # components/, hooks/, services/, mappers/, schemas/, types.ts, index.ts
│   ├── categories/
│   ├── cart/
│   ├── rfq/
│   ├── orders/
│   └── auth/
├── lib/
│   ├── api/              # httpClient fetch wrapper
│   ├── config/           # env configuration validated with Zod
│   ├── i18n/             # next-intl configuration
│   └── utils/            # formatters (formatCurrency, formatNumber, formatQuantityStep), cn
├── mocks/
│   ├── handlers/         # MSW feature handlers
│   ├── data/             # Realistic 44+ optics products, categories
│   ├── browser.ts        # Browser MSW worker
│   └── server.ts         # Node MSW server for tests
└── tests/
    ├── unit/             # Unit tests for tier math and DTO mappers
    ├── components/       # Component tests for ProductCard and ProductFilters
    └── utils/            # renderWithProviders test helper
```

---

## Getting Started

### 1. Installation
```bash
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Toggle network mock interception (true = MSW enabled, false = real API)
NEXT_PUBLIC_USE_MOCKS=true

# Real backend API base URL
NEXT_PUBLIC_API_BASE_URL=https://api.b2b-optics.com/v1
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Switch Between Mock vs Real API

1. **To use Mock Data (MSW):**
   Set `NEXT_PUBLIC_USE_MOCKS=true` in `.env.local`.
   Application code contains **zero** mock-specific conditional branches (`if (useMock)`). MSW intercepts HTTP requests at the browser network layer.

2. **To point to a Real Backend API:**
   Set `NEXT_PUBLIC_USE_MOCKS=false` and configure `NEXT_PUBLIC_API_BASE_URL=https://your-backend.com/api/v1`.

---

## How to Add a New Feature

1. **Create feature directory under `src/features/<feature-name>/`:**
   - `types.ts`: Define domain types.
   - `schemas/<name>Schema.ts`: Define Zod runtime validation schemas for DTOs.
   - `mappers/<name>Mapper.ts`: Convert DTO (snake_case) to Domain (camelCase).
   - `services/<name>Service.ts`: Define service calling `httpClient` and parsing DTOs with Zod.
   - `hooks/use<Feature>.ts`: Wrap service call in TanStack Query `useQuery` or `useMutation`.
   - `components/`: Build pure props-in / UI-out components.
   - `index.ts`: Export public API for the feature.

2. **Add thin page in `src/app/`:**
   Import feature hooks and components only via `@/features/<feature-name>`.

---

## How to Add a New Mock Handler

1. Create handler in `src/mocks/handlers/<feature>Handler.ts` using MSW `http`:
   ```ts
   import { http, HttpResponse, delay } from 'msw';

   export const myHandlers = [
     http.get('*/my-endpoint', async () => {
       await delay(200);
       return HttpResponse.json({ items: [] });
     }),
   ];
   ```
2. Import and register `myHandlers` in `src/mocks/handlers/index.ts`. Both development server and Vitest tests will automatically utilize the new handler.

---

## Naming & Architecture Conventions

- **Types vs DTOs:** Domain types use camelCase (`Product`, `minQuantity`). DTOs reflect backend responses (`ProductDto`, `min_quantity`).
- **Services:** Pure async objects (`productService.list()`). Never import services in UI components.
- **Hooks:** Custom React hooks (`useProducts()`). Pages & containers connect UI to state via hooks.
- **Components:** Explicit props interfaces (`ProductCardProps`). No `any` types.

---

## Running Verification Commands

- **Typecheck:** `npm run typecheck`
- **Unit & Component Tests:** `npm run test`
- **End-to-End Tests:** `npx playwright test`
- **Storybook:** `npm run storybook`
- **ESLint:** `npm run lint`

---

## Definition of Done Verification Checklist

- [x] Pure props-in / UI-out components in `components/` and `features/*/components/` with zero direct fetches or service imports.
- [x] Tiered volume pricing engine & MOQ step validation math thoroughly tested.
- [x] Dynamic attribute filter generation derived from backend/MSW response.
- [x] Restricted price visibility (`priceVisibility: "approved_only"`) with interactive company verification toggle demo in Dashboard.
- [x] 44 realistic optics inventory items across 6 categories with MSW pagination, search, sorting, dynamic filters, and error simulation (`?mock_error=500`).
- [x] All commands (`typecheck`, `test`, `lint`) passing cleanly.
