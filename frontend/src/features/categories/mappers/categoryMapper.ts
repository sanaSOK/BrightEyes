import { Category } from '../types';
import { CategoryDto } from '../schemas/categorySchema';

export function mapCategoryFromDto(dto: CategoryDto): Category {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    description: dto.description,
    icon: dto.icon,
    productCount: dto.product_count,
  };
}
