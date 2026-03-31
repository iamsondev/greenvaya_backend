import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { Role } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest.js';
import { PaymentControllers } from './payment.controller.js';
import { PaymentValidation } from './payment.validation.js';

const router = Router();

router.post(
  '/create-checkout-session',
  auth(Role.MEMBER, Role.ADMIN),
  validateRequest(PaymentValidation.createCheckoutSessionValidationSchema),
  PaymentControllers.createCheckoutSession,
);

router.get(
  '/verify',
  auth(Role.MEMBER, Role.ADMIN),
  PaymentControllers.verifyPayment,
);

router.get(
  '/my-purchases',
  auth(Role.MEMBER, Role.ADMIN),
  PaymentControllers.getUserPurchases,
);

router.get(
  '/my-purchases/:ideaId',
  auth(Role.MEMBER, Role.ADMIN),
  PaymentControllers.checkPurchase,
);

const paymentRouter = router;
export default paymentRouter;
