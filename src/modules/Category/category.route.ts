import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { Role } from '../../generated/prisma/enums.js';
import { CategoryControllers } from './category.controller.js';

const router = Router();

router.post(
  '/',
  auth(Role.ADMIN),
  CategoryControllers.createCategory,
);

router.get(
  '/',
  CategoryControllers.getAllCategories,
);

const categoryRouter = router;
export default categoryRouter;
