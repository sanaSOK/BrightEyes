'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ShippingHighlight, DealProgress } from '../types';
import { PriceTag } from '@/components/shared/PriceTag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Globe,
  Clock,
  ShoppingCart,
  FileText,
  Heart,
  Glasses,
  Star,
  Truck,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list' | 'compact' | 'deal';
  userApproved?: boolean;
  onAddToCart?: (product: Product, quantity: number) => void;
  onRequestQuote?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  discountPercent?: number;
  badges?: string[];
  shippingHighlight?: ShippingHighlight;
  rating?: number;
  soldCount?: number;
  progress?: DealProgress;
  footer?: React.ReactNode;
  className?: string;
}

export function ProductCard({
  product,
  variant = 'grid',
  userApproved = true,
  onAddToCart,
  onRequestQuote,
  onToggleWishlist,
  isWishlisted = false,
  discountPercent: customDiscount,
  badges: customBadges,
  shippingHighlight: customShipping,
  rating: customRating,
  soldCount: customSoldCount,
  progress: customProgress,
  footer,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const primaryImage = product.images?.[0];
  const isOutOfStock = product.totalStock <= 0;

  const discount = customDiscount ?? product.discountPercent;
  const badges = customBadges ?? product.badges ?? [];
  const shipping = customShipping ?? product.shippingHighlight;
  const rating = customRating ?? product.rating;
  const soldCount = customSoldCount ?? product.soldCount;
  const dealProgress = customProgress ?? product.dealProgress;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, product.moq);
    }
  };

  const renderImage = () => {
    if (primaryImage && !imageError) {
      return (
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 text-slate-600">
        <Glasses className="h-10 w-10 mb-1" />
        <span className="text-[10px] uppercase font-medium">Optics Image</span>
      </div>
    );
  };

  // Compact Variant
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'group relative flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3 hover:border-cyan-800/60 hover:bg-slate-900 transition-all shadow-sm',
          className
        )}
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-slate-950 flex-shrink-0 border border-slate-800">
            {renderImage()}
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/products/${product.slug}`}>
              <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                {product.title}
              </h4>
            </Link>
            <div className="mt-0.5 flex items-center space-x-2 text-[11px] text-slate-400">
              <span>{product.supplier.name}</span>
              <span>•</span>
              <span>MOQ {product.moq} pcs</span>
            </div>
          </div>
        </div>

        <div className="ml-3 text-right flex-shrink-0">
          <PriceTag product={product} userApproved={userApproved} size="sm" />
        </div>
      </div>
    );
  }

  // Deal Variant
  if (variant === 'deal') {
    return (
      <div
        className={cn(
          'group relative flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 hover:border-amber-500/60 transition-all shadow-xl shadow-amber-950/20',
          className
        )}
      >
        {/* Deal Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Badge variant="warning" className="text-[10px] bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Flame className="mr-1 h-3 w-3 text-amber-400" /> Hot Deal
            </Badge>
            {discount && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            )}
          </div>
          {onToggleWishlist && (
            <button
              onClick={() => onToggleWishlist(product)}
              className="rounded-full bg-slate-950/70 p-1.5 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800"
              aria-label="Wishlist"
            >
              <Heart className={cn('h-3.5 w-3.5', isWishlisted && 'fill-rose-500 text-rose-500')} />
            </button>
          )}
        </div>

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 mb-3"
        >
          {renderImage()}
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                {product.title}
              </h3>
            </Link>

            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{product.supplier.name}</span>
              {soldCount !== undefined && (
                <span className="text-[11px] text-slate-400">{soldCount} sold</span>
              )}
            </div>
          </div>

          <PriceTag product={product} userApproved={userApproved} onRequestQuote={onRequestQuote ? () => onRequestQuote(product) : undefined} size="md" />

          {/* Progress Bar */}
          {dealProgress && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Claimed {dealProgress.claimedPercent}%</span>
                <span className="font-semibold text-amber-400">{dealProgress.unitsLeft} pcs left</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${dealProgress.claimedPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Row or Custom Footer */}
          <div className="pt-2 border-t border-slate-800/80">
            {footer ? (
              footer
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                Claim Wholesale Deal (MOQ {product.moq})
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List Variant
  if (variant === 'list') {
    return (
      <div
        className={cn(
          'group relative flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-cyan-800/60 hover:bg-slate-900/90 transition-all shadow-md',
          className
        )}
      >
        {onToggleWishlist && (
          <button
            onClick={() => onToggleWishlist(product)}
            className="absolute right-4 top-4 z-10 rounded-full bg-slate-950/70 p-2 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800"
            aria-label="Wishlist"
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-rose-500 text-rose-500')} />
          </button>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="relative h-48 sm:h-40 w-full sm:w-56 overflow-hidden rounded-xl bg-slate-950 flex-shrink-0 border border-slate-800/80"
        >
          {renderImage()}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-cyan-400">{product.categoryName}</span>
              <span>•</span>
              <span className="flex items-center">
                <Globe className="mr-1 h-3 w-3" />
                {product.supplier.countryOfOrigin}
              </span>
              {rating && (
                <>
                  <span>•</span>
                  <span className="flex items-center text-amber-400 font-medium">
                    <Star className="mr-1 h-3 w-3 fill-amber-400" />
                    {rating} {product.ratingCount ? `(${product.ratingCount})` : ''}
                  </span>
                </>
              )}
            </div>

            <Link href={`/products/${product.slug}`}>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                {product.title}
              </h3>
            </Link>

            <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Badges & Shipping Highlights */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {badges.map((b, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] py-0">
                  {b}
                </Badge>
              ))}
              {shipping && (
                <span className="flex items-center text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Truck className="mr-1 h-3 w-3" />
                  {shipping.text}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
            <PriceTag product={product} userApproved={userApproved} onRequestQuote={onRequestQuote ? () => onRequestQuote(product) : undefined} size="md" />

            {footer ? (
              footer
            ) : (
              <div className="flex items-center space-x-2">
                {onRequestQuote && (
                  <Button
                    onClick={() => onRequestQuote(product)}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-200"
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                    Request Quote
                  </Button>
                )}
                {onAddToCart && !isOutOfStock && (
                  <Button
                    onClick={handleAddToCart}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-500"
                  >
                    <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                    Add {product.moq} pcs
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid Variant (Default)
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-cyan-800/60 hover:bg-slate-900/90 transition-all shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.supplier.verified && (
            <Badge variant="verified" className="text-[10px] py-0 px-2">
              <ShieldCheck className="mr-1 h-3 w-3" /> Verified
            </Badge>
          )}
          {discount && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {badges.map((b, idx) => (
            <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-1.5">
              {b}
            </Badge>
          ))}
        </div>

        {onToggleWishlist && (
          <button
            onClick={() => onToggleWishlist(product)}
            className="rounded-full bg-slate-950/70 p-1.5 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800"
            aria-label="Wishlist"
          >
            <Heart className={cn('h-3.5 w-3.5', isWishlisted && 'fill-rose-500 text-rose-500')} />
          </button>
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 mb-3"
      >
        {renderImage()}
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
            <span className="font-semibold text-cyan-400 uppercase tracking-wider">
              {product.categoryName}
            </span>
            {rating && (
              <span className="flex items-center text-amber-400 font-medium">
                <Star className="mr-0.5 h-3 w-3 fill-amber-400" />
                {rating}
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-[130px] text-slate-300">{product.supplier.name}</span>
            {soldCount !== undefined && (
              <span className="text-[11px] text-slate-400">{soldCount} sold</span>
            )}
          </div>

          {shipping && (
            <div className="mt-2 flex items-center text-[11px] text-emerald-400 font-medium">
              <Truck className="mr-1 h-3 w-3" />
              <span>{shipping.text}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-end justify-between gap-2">
          <PriceTag
            product={product}
            userApproved={userApproved}
            onRequestQuote={onRequestQuote ? () => onRequestQuote(product) : undefined}
            size="sm"
          />

          {footer ? (
            footer
          ) : (
            <div className="flex items-center space-x-1">
              {onRequestQuote && (
                <Button
                  onClick={() => onRequestQuote(product)}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 text-amber-400 hover:bg-slate-800"
                  title="Request Quote"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              )}
              {onAddToCart && !isOutOfStock && (
                <Button
                  onClick={handleAddToCart}
                  size="icon"
                  className="h-8 w-8 bg-cyan-600 hover:bg-cyan-500 text-white"
                  title={`Add ${product.moq} pcs`}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
