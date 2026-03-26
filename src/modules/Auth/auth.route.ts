import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';

import { UserValidation } from '../User/user.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(UserValidation.createUserValidationSchema),
  AuthControllers.registerUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/refresh-token',
  AuthControllers.refreshToken,
);

const authRouter = router;
export default authRouter;
