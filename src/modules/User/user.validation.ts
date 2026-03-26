import { z } from 'zod';
import { Role } from '../../generated/prisma/enums.js';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    profileImage: z.string().optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    profileImage: z.string().optional(),
    role: z.nativeEnum(Role).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
