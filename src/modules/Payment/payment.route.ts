import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { Role } from '../../generated/prisma/enums.js';
import { PaymentControllers } from './payment.controller.js';

const router = Router();

router.post(
  '/create-checkout-session',
  auth(Role.MEMBER, Role.ADMIN),
  PaymentControllers.createCheckoutSession,
);

router.get(
  '/verify',
  auth(Role.MEMBER, Role.ADMIN),
  PaymentControllers.verifyPayment,
);

const paymentRouter = router;
export default paymentRouter;
