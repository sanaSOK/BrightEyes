import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { Product } from '../types';

const sampleProduct: Product = {
  id: 'prod-sb-1',
  slug: 'mazzucchelli-vintage-square-acetate-frame',
  title: 'Mazzucchelli Vintage Square Acetate Frame AC-801',
  description: 'Hand-polished Italian Mazzucchelli cellulose acetate frame with 5-barrel OBE spring hinges.',
  categoryId: 'cat-acetate-frames',
  categoryName: 'Acetate Eyeglass Frames',
  images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'],
  supplier: {
    id: 'sup-milano',
    name: 'Milano Acetate Labs',
    verified: true,
    countryOfOrigin: 'Italy',
    leadTimeDays: 14,
  },
  moq: 50,
  quantityStep: 10,
  priceTiers: [
    { minQuantity: 50, maxQuantity: 199, unitPrice: 24.50 },
    { minQuantity: 200, unitPrice: 19.80 },
  ],
  compareAtPrice: 32.00,
  discountPercent: 23,
  badges: ['Choice', 'Verified', 'Top Seller'],
  shippingHighlight: { text: 'Free Air Express' },
  rating: 4.9,
  soldCount: 3200,
  dealProgress: { claimedPercent: 75, unitsLeft: 600 },
  variants: [
    { id: 'v1', sku: 'AC801-BLK', name: 'Gloss Black', stock: 1200 },
  ],
  attributes: { frame_material: 'Italian Acetate' },
  priceVisibility: 'public',
  totalStock: 1200,
  createdAt: '2026-01-15T08:00:00Z',
};

const meta: Meta<typeof ProductCard> = {
  title: 'Features/Products/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['grid', 'list', 'compact', 'deal'],
    },
    userApproved: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const GridVariant: Story = {
  args: {
    product: sampleProduct,
    variant: 'grid',
    userApproved: true,
  },
};

export const ListVariant: Story = {
  args: {
    product: sampleProduct,
    variant: 'list',
    userApproved: true,
  },
};

export const CompactVariant: Story = {
  args: {
    product: sampleProduct,
    variant: 'compact',
    userApproved: true,
  },
};

export const DealVariant: Story = {
  args: {
    product: sampleProduct,
    variant: 'deal',
    userApproved: true,
  },
};

export const OutOfStockState: Story = {
  args: {
    product: {
      ...sampleProduct,
      totalStock: 0,
    },
    variant: 'grid',
    userApproved: true,
  },
};

export const RestrictedPriceHiddenState: Story = {
  args: {
    product: {
      ...sampleProduct,
      priceVisibility: 'approved_only',
    },
    variant: 'grid',
    userApproved: false,
  },
};

export const CustomFooterSlot: Story = {
  args: {
    product: sampleProduct,
    variant: 'grid',
    userApproved: true,
    footer: (
      <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs">
        Custom Wholesale Action
      </button>
    ),
  },
};

export const GridSkeleton = () => (
  <div className="w-72">
    <ProductCardSkeleton variant="grid" />
  </div>
);

export const ListSkeleton = () => (
  <div className="max-w-2xl">
    <ProductCardSkeleton variant="list" />
  </div>
);

export const CompactSkeleton = () => (
  <div className="w-80">
    <ProductCardSkeleton variant="compact" />
  </div>
);

export const MissingImageFallback: Story = {
  args: {
    product: {
      ...sampleProduct,
      images: [],
    },
    variant: 'grid',
    userApproved: true,
  },
};

