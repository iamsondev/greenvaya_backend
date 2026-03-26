import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { Role } from '../../generated/prisma/enums';

const router = Router();

// Admin: View all users
router.get(
    '/',
    auth(Role.ADMIN),
    UserControllers.getAllUsers,
);

// Admin/Owner: View single user
router.get(
    '/:id',
    auth(Role.ADMIN, Role.MEMBER),
    UserControllers.getSingleUser,
);

// Admin: Update user (role, status)
router.patch(
    '/:id',
    auth(Role.ADMIN),
    validateRequest(UserValidation.updateUserValidationSchema),
    UserControllers.updateUser,
);

const userRouter = router;
export default userRouter;
