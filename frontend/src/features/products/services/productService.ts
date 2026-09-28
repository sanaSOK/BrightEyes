import { httpClient } from '@/lib/api/httpClient';
import { ProductFilterParams, PaginatedProductsResponse, Product } from '../types';
import { PaginatedProductsDtoSchema, ProductDtoSchema } from '../schemas/productSchema';
import { mapPaginatedProductsFromDto, mapProductFromDto } from '../mappers/productMapper';

export const productService = {
  async list(params: ProductFilterParams = {}): Promise<PaginatedProductsResponse> {
    const queryParams: Record<string, string | number | boolean | (string | number)[] | undefined> = {
      category_id: params.categoryId,
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 12,
      sort_by: params.sortBy,
      min_price: params.minPrice,
      max_price: params.maxPrice,
      in_stock_only: params.inStockOnly,
    };

    if (params.attributes) {
      Object.entries(params.attributes).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          queryParams[`attr_${key}`] = val.join(',');
        } else if (val !== undefined && val !== '') {
          queryParams[`attr_${key}`] = val;
        }
      });
    }

    const rawData = await httpClient<unknown>('/products', {
      params: queryParams,
    });

    const parsedDto = PaginatedProductsDtoSchema.parse(rawData);
    return mapPaginatedProductsFromDto(parsedDto);
  },

  async getBySlug(slug: string): Promise<Product> {
    const rawData = await httpClient<unknown>(`/products/${slug}`);
    const parsedDto = ProductDtoSchema.parse(rawData);
    return mapProductFromDto(parsedDto);
  },
};
