'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts, ProductFilterParams, ProductGrid, ProductFilters, Product } from '@/features/products';
import { useCategories } from '@/features/categories';
import { useCartStore } from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Pagination } from '@/components/shared/Pagination';
import { Modal } from '@/components/ui/modal';
import { RfqForm } from '@/features/rfq';
import { LayoutGrid, List } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryIdParam = searchParams.get('category_id') || undefined;
  const searchParam = searchParams.get('search') || undefined;

  const [filters, setFilters] = useState<ProductFilterParams>({
    categoryId: categoryIdParam,
    search: searchParam,
    page: 1,
    limit: 12,
    sortBy: 'popularity',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedRfqProduct, setSelectedRfqProduct] = useState<Product | null>(null);

  const { data, isLoading, isError, refetch } = useProducts(filters);
  const { data: categories } = useCategories();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const userApproved = user?.company.approvalStatus === 'approved';

  const handleAddToCart = (product: Product, quantity: number) => {
    if (product.variants && product.variants.length > 0) {
      addItem(product, product.variants[0], quantity || product.moq);
    }
  };

  const handleRequestQuote = (product: Product) => {
    setSelectedRfqProduct(product);
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 12, sortBy: 'popularity' });
    router.push('/products');
  };

  return (
    <PageContainer
      title="B2B Optical Products Catalog"
      description="Source wholesale frames, lenses, OBE hinges, and components directly from audited optical factories."
      actionSlot={
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle: Only Grid and List */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={filters.sortBy || 'popularity'}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as ProductFilterParams['sortBy'],
                page: 1,
              }))
            }
            className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="popularity">Sort: Most Popular</option>
            <option value="orders">Sort: Most Orders</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Sort: Newest Arrival</option>
            <option value="moq_asc">MOQ: Lowest First</option>
          </select>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Dynamic Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            availableAttributes={data?.availableAttributes}
            filters={filters}
            onChange={(newF) => setFilters(newF)}
            onReset={handleResetFilters}
          />
        </div>

        {/* Products Grid / List */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <ProductGrid
            products={data?.items}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            variant={viewMode}
            userApproved={userApproved}
            onAddToCart={handleAddToCart}
            onRequestQuote={handleRequestQuote}
            onClearFilters={handleResetFilters}
          />

          {data && (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalItems={data.total}
              limit={data.limit}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )}
        </div>
      </div>

      {/* RFQ Request Modal */}
      {selectedRfqProduct && (
        <Modal
          isOpen={Boolean(selectedRfqProduct)}
          onClose={() => setSelectedRfqProduct(null)}
          title={`Wholesale Quote: ${selectedRfqProduct.title}`}
          description={`Supplier: ${selectedRfqProduct.supplier.name} • MOQ: ${selectedRfqProduct.moq} pcs`}
        >
          <RfqForm
            initialItem={{
              productId: selectedRfqProduct.id,
              productTitle: selectedRfqProduct.title,
              variantSku: selectedRfqProduct.variants[0]?.sku,
              quantity: selectedRfqProduct.moq,
            }}
            onSuccess={() => setSelectedRfqProduct(null)}
          />
        </Modal>
      )}
    </PageContainer>
  );
}
