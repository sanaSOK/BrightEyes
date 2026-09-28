import { productsHandlers } from './productsHandler';
import { categoriesHandlers } from './categoriesHandler';
import { rfqHandlers } from './rfqHandler';

export const handlers = [
  ...productsHandlers,
  ...categoriesHandlers,
  ...rfqHandlers,
];
