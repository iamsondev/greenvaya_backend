import { Router } from 'express';
import auth from '../../middlewares/auth';
import { Role } from '../../generated/prisma/enums';
import { CategoryControllers } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';

const router = Router();

router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.get(
  '/',
  CategoryControllers.getAllCategories,
);

const categoryRouter = router;
export default categoryRouter;
