import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

// --- Adjusted schema to match honc-api ---
export const userSchema = z.object({
  id: z.number(),
  googleId: z.string().nullable().optional(),
  name: z.string(),
  email: z.string(),
  avatar: z.string().nullable().optional(),
  is_admin: z.boolean(),
  createdAt: z.union([z.coerce.date(), z.string(), z.number()]),
  updatedAt: z.union([z.coerce.date(), z.string(), z.number()]),
});
export type User = z.infer<typeof userSchema>;

export const userListSchema = z.array(userSchema)
