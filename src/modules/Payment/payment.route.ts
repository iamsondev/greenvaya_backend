import { Router } from 'express';
import auth from '../../middlewares/auth';
import { Role } from '../../generated/prisma/enums';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentControllers } from './payment.controller';
import { PaymentValidation } from './payment.validation';

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

const paymentRouter = router;
export default paymentRouter;
