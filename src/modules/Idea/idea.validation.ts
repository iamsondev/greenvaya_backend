import { z } from 'zod';
import { IdeaStatus } from '../../generated/prisma/enums.js';

const createIdeaValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    problemStatement: z.string().min(1, 'Problem statement is required'),
    proposedSolution: z.string().min(1, 'Proposed solution is required'),
    description: z.string().min(1, 'Description is required'),
    categoryId: z.string().uuid('Invalid category ID'),
    isPaid: z.boolean().optional(),
    price: z.number().optional().nullable(),
    images: z.array(z.string()).optional(),
  }),
});

const updateIdeaValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    problemStatement: z.string().optional(),
    proposedSolution: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    isPaid: z.boolean().optional(),
    price: z.number().optional().nullable(),
    images: z.array(z.string()).optional(),
    status: z.nativeEnum(IdeaStatus).optional(),
  }),
});

const adminActionValidationSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
    feedback: z.string().optional(),
  }),
});

export const IdeaValidation = {
  createIdeaValidationSchema,
  updateIdeaValidationSchema,
  adminActionValidationSchema,
};
