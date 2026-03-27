import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { AuthControllers } from './auth.controller.js';
import { AuthValidation } from './auth.validation.js';

import { UserValidation } from '../User/user.validation.js';

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

router.post(
  '/logout',
  AuthControllers.logoutUser,
);

const authRouter = router;
export default authRouter;
