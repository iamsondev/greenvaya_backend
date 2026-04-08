import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../User/user.utils.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { PaymentControllers } from './payment.controller.js';
import { PaymentValidation } from './payment.validation.js';

const router = Router();

router.post(
  '/create-checkout-session',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  validateRequest(PaymentValidation.createCheckoutSessionValidationSchema),
  PaymentControllers.createCheckoutSession,
);

router.get(
  '/verify',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  PaymentControllers.verifyPayment,
);

router.get(
  '/my-purchases',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  PaymentControllers.getUserPurchases,
);

router.get(
  '/my-purchases/:ideaId',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  PaymentControllers.checkPurchase,
);

const paymentRouter = router;
export default paymentRouter;
