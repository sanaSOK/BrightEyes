import { http, HttpResponse, delay } from 'msw';
import { mockProductsDto } from '../data/productsData';

export const productsHandlers = [
  http.get('*/products', async ({ request }) => {
    const url = new URL(request.url);
    const mockError = url.searchParams.get('mock_error');

    if (mockError) {
      await delay(200);
      const status = Number(mockError) || 500;
      return HttpResponse.json(
        { message: `Simulated server error ${status}` },
        { status }
      );
    }

    await delay(300);

    const categoryId = url.searchParams.get('category_id');
    const search = url.searchParams.get('search')?.toLowerCase();
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 12;
    const sortBy = url.searchParams.get('sort_by') || url.searchParams.get('sort');
    const minPrice = url.searchParams.get('min_price') ? Number(url.searchParams.get('min_price')) : undefined;
    const maxPrice = url.searchParams.get('max_price') ? Number(url.searchParams.get('max_price')) : undefined;
    const inStockOnly = url.searchParams.get('in_stock_only') === 'true';

    // Extract dynamic attribute filter params (attr_*)
    const attrFilters: Record<string, string[]> = {};
    url.searchParams.forEach((value, key) => {
      if (key.startsWith('attr_')) {
        const attrKey = key.replace('attr_', '');
        attrFilters[attrKey] = value.split(',').map((v) => v.trim());
      }
    });

    let filtered = [...mockProductsDto];

    // Category filter
    if (categoryId) {
      filtered = filtered.filter((p) => p.category_id === categoryId);
    }

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.supplier.name.toLowerCase().includes(search) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(search))
      );
    }

    // In Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.total_stock > 0);
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filtered = filtered.filter((p) => {
        const lowestPrice = Math.min(...p.price_tiers.map((t) => t.unit_price));
        if (minPrice !== undefined && lowestPrice < minPrice) return false;
        if (maxPrice !== undefined && lowestPrice > maxPrice) return false;
        return true;
      });
    }

    // Dynamic Attribute filters
    if (Object.keys(attrFilters).length > 0) {
      filtered = filtered.filter((p) => {
        return Object.entries(attrFilters).every(([key, filterValues]) => {
          const productAttrVal = p.attributes[key];
          if (productAttrVal === undefined) return false;
          if (Array.isArray(productAttrVal)) {
            return productAttrVal.some((val) => filterValues.includes(String(val)));
          }
          return filterValues.includes(String(productAttrVal));
        });
      });
    }

    // Generate dynamic attribute definitions from current matching products
    const attributeMap: Record<string, Set<string | number>> = {};
    filtered.forEach((p) => {
      Object.entries(p.attributes).forEach(([attrKey, attrVal]) => {
        if (!attributeMap[attrKey]) {
          attributeMap[attrKey] = new Set();
        }
        if (Array.isArray(attrVal)) {
          attrVal.forEach((v) => attributeMap[attrKey].add(v));
        } else {
          attributeMap[attrKey].add(attrVal);
        }
      });
    });

    const availableAttributes = Object.entries(attributeMap).map(([key, valueSet]) => {
      const formattedLabel = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return {
        key,
        label: formattedLabel,
        type: 'select' as const,
        options: Array.from(valueSet).sort(),
      };
    });

    // Sorting
    if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === 'orders') {
      filtered.sort((a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0));
    } else if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price_tiers[0].unit_price - b.price_tiers[0].unit_price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price_tiers[0].unit_price - a.price_tiers[0].unit_price);
    } else if (sortBy === 'moq_asc') {
      filtered.sort((a, b) => a.moq - b.moq);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      items: paginatedItems,
      total,
      page,
      limit,
      total_pages: totalPages,
      available_attributes: availableAttributes,
    });
  }),

  http.get('*/products/:slug', async ({ params, request }) => {
    const url = new URL(request.url);
    const mockError = url.searchParams.get('mock_error');

    if (mockError) {
      await delay(200);
      const status = Number(mockError) || 500;
      return HttpResponse.json({ message: `Simulated server error ${status}` }, { status });
    }

    await delay(250);

    const { slug } = params;
    const product = mockProductsDto.find((p) => p.slug === slug || p.id === slug);

    if (!product) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),
];
