import { http, HttpResponse, delay } from 'msw';
import { mockCategoriesDto } from '../data/categoriesData';

export const categoriesHandlers = [
  http.get('*/categories', async () => {
    await delay(150);
    return HttpResponse.json(mockCategoriesDto);
  }),
];
