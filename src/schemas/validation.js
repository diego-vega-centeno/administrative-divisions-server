import { z } from 'zod';
import { escape } from 'lodash-es';


// Login schema
export const loginSchema = z.object({
  email: z
    .email('Invalid email format')
    .min(1, 'Email is required')
    .transform(value => escape(value)),
});

// Favorites schema
export const favoriteSchema = z.object({
  osmRelId: z
    .string()
    .min(1, 'osmRelId is required')
    .transform(value => escape(value)),
  osmRelName: z
    .string()
    .min(1, 'osmRelName is required')
    .transform(value => escape(value)),
});

