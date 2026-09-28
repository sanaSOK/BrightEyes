import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_USE_MOCKS: z
    .string()
    .optional()
    .transform((val) => val === undefined || val === 'true' || val === '1'),
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .default('https://api.b2b-optics.com/v1'),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
