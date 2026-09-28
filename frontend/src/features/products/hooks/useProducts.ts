import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ProductFilterParams } from '../types';

export function useProducts(params: ProductFilterParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.list(params),
  });
}

export function useInfiniteProducts(params: Omit<ProductFilterParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      productService.list({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
