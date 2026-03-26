import { Router } from 'express';
import auth from '../../middlewares/auth';
import { Role } from '../../generated/prisma/enums';
import { CategoryControllers } from './category.controller';

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
