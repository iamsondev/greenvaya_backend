import { z } from 'zod';

const createCheckoutSessionValidationSchema = z.object({
  body: z.object({
    ideaId: z.string().min(1, 'Idea ID is required'),
  }),
});

export const PaymentValidation = {
  createCheckoutSessionValidationSchema,
};
