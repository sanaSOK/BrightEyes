import { httpClient } from '@/lib/api/httpClient';
import { Category } from '../types';
import { CategoryListDtoSchema } from '../schemas/categorySchema';
import { mapCategoryFromDto } from '../mappers/categoryMapper';

export const categoryService = {
  async list(): Promise<Category[]> {
    const rawData = await httpClient<unknown>('/categories');
    const parsedDto = CategoryListDtoSchema.parse(rawData);
    return parsedDto.map(mapCategoryFromDto);
  },
};
