'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useProduct,
  ProductGallery,
  VariantSelector,
  TierPriceTable,
  ProductVariant,
} from '@/features/products';
import { useCartStore } from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import { PageContainer } from '@/components/layout/PageContainer';
import { PriceTag } from '@/components/shared/PriceTag';
import { QuantityInput } from '@/components/shared/QuantityInput';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { RfqForm } from '@/features/rfq';
import { ErrorState } from '@/components/shared/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShieldCheck,
  Globe,
  Clock,
  ShoppingCart,
  FileText,
  Building,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || '';

  const { data: product, isLoading, isError, refetch } = useProduct(slug);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const userApproved = user?.company.approvalStatus === 'approved';

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Synchronize initial variant and MOQ when product loads
  React.useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
      setQuantity(product.moq);
    }
  }, [product]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isError || !product) {
    return (
      <PageContainer>
        <ErrorState
          title="Product Not Found"
          message="The requested optical item could not be retrieved."
          onRetry={refetch}
        />
      </PageContainer>
    );
  }

  const activeVariant = selectedVariant || product.variants[0];
  const isOutOfStock = product.totalStock <= 0;

  const handleAddToCart = () => {
    if (activeVariant && quantity >= product.moq) {
      addItem(product, activeVariant, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3000);
    }
  };

  return (
    <PageContainer>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Products Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gallery & Specifications */}
        <div className="lg:col-span-7 space-y-8">
          <ProductGallery images={product.images} title={product.title} />

          {/* Detailed Specifications */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Technical Specifications & Attributes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.attributes).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg bg-slate-950/60 p-3 border border-slate-800/80"
                >
                  <span className="capitalize font-semibold text-slate-400">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-slate-100">
                    {Array.isArray(val) ? val.join(', ') : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Title, Supplier Card, Tier Pricing & Purchasing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
              <span className="font-semibold text-cyan-400">{product.categoryName}</span>
              <span>•</span>
              <span className="text-slate-400">Item ID: {product.id}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-100">{product.title}</h1>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">{product.description}</p>
          </div>

          {/* Supplier Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">{product.supplier.name}</span>
                {product.supplier.verified && (
                  <Badge variant="verified" className="text-[10px] py-0">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified Factory
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center">
                <Globe className="mr-1 h-3.5 w-3.5 text-slate-500" />
                {product.supplier.countryOfOrigin}
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-3.5 w-3.5 text-slate-500" />
                Lead Time: {product.supplier.leadTimeDays} days
              </span>
            </div>
          </div>

          {/* Price Tag Summary */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <PriceTag
              product={product}
              quantity={quantity}
              userApproved={userApproved}
              onRequestQuote={() => setIsRfqModalOpen(true)}
              size="lg"
            />
          </div>

          {/* Tier Pricing Breakdown */}
          {product.priceVisibility === 'public' || userApproved ? (
            <TierPriceTable priceTiers={product.priceTiers} quantity={quantity} />
          ) : null}

          {/* Variant Selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariantId={activeVariant?.id}
            onSelectVariant={(v) => setSelectedVariant(v)}
          />

          {/* Quantity Selector & Purchasing Actions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Order Quantity
              </label>
              <span className="text-xs text-slate-400">
                MOQ: {product.moq} pcs • Step: {product.quantityStep} pcs
              </span>
            </div>

            <QuantityInput
              value={quantity}
              onChange={(val) => setQuantity(val)}
              moq={product.moq}
              step={product.quantityStep}
              disabled={isOutOfStock}
            />

            {addedToast && (
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <span>Added {quantity} pcs of {activeVariant?.sku} to Cart!</span>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              {!isOutOfStock && (
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              )}

              <Button
                onClick={() => setIsRfqModalOpen(true)}
                variant="outline"
                size="lg"
                className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                <FileText className="mr-2 h-4 w-4 text-amber-400" />
                Request Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* RFQ Modal */}
      {isRfqModalOpen && (
        <Modal
          isOpen={isRfqModalOpen}
          onClose={() => setIsRfqModalOpen(false)}
          title={`Wholesale Quote: ${product.title}`}
          description={`Variant: ${activeVariant?.name || 'Default'} (${activeVariant?.sku})`}
        >
          <RfqForm
            initialItem={{
              productId: product.id,
              productTitle: product.title,
              variantId: activeVariant?.id,
              variantSku: activeVariant?.sku,
              quantity,
            }}
            onSuccess={() => setIsRfqModalOpen(false)}
          />
        </Modal>
      )}
    </PageContainer>
  );
}
