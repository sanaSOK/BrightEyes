import { CategoryDto } from '@/features/categories/schemas/categorySchema';

export const mockCategoriesDto: CategoryDto[] = [
  {
    id: 'cat-acetate-frames',
    slug: 'acetate-frames',
    name: 'Acetate Eyeglass Frames',
    description: 'Premium handcrafted Mazzucchelli acetate optical frames for luxury optical brands.',
    product_count: 12,
  },
  {
    id: 'cat-titanium-frames',
    slug: 'titanium-frames',
    name: 'Titanium Eyeglass Frames',
    description: 'Ultra-lightweight Japanese Pure Titanium & Beta-Titanium optical frames.',
    product_count: 10,
  },
  {
    id: 'cat-tr90-frames',
    slug: 'tr90-frames',
    name: 'TR90 Memory Frames',
    description: 'Flexible, high-durability Swiss EMS TR90 injection molded frames.',
    product_count: 8,
  },
  {
    id: 'cat-optical-lenses',
    slug: 'optical-lenses',
    name: 'Optical & Demo Lenses',
    description: 'CR-39, 1.56, 1.61, 1.67 MR-8 and 1.74 High Index finished and semi-finished lenses.',
    product_count: 6,
  },
  {
    id: 'cat-components',
    slug: 'components',
    name: 'Hinges, Screws & Nose Pads',
    description: 'German OBE 5-barrel spring hinges, titanium nose pads, and stainless steel screws.',
    product_count: 6,
  },
  {
    id: 'cat-cases-packaging',
    slug: 'cases-packaging',
    name: 'Eyewear Cases & Packaging',
    description: 'Custom eco-leather hard cases, microfiber cloths, and branded presentation boxes.',
    product_count: 4,
  },
];
