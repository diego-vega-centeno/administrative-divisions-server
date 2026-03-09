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
const relationSchema = z.object({
  relId: z
    .string()
    .min(1, 'relation id is required')
    .transform(value => escape(value)),
  relName: z
    .string()
    .min(1, 'relation name is required')
    .transform(value => escape(value)),
});

const relationsSchema = z.array(relationSchema);

// layers schema
export const layerSchema = z.object({
  title: z
    .string()
    .min(1, 'relation id is required')
    .transform(value => escape(value)),
  relations: relationsSchema
})