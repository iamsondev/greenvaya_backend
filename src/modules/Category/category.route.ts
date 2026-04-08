import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../User/user.utils.js';
import { CategoryControllers } from './category.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { CategoryValidation } from './category.validation.js';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.get(
  '/',
  CategoryControllers.getAllCategories,
);

const categoryRouter = router;
export default categoryRouter;
