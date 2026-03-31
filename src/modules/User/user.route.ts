import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { UserControllers } from './user.controller.js';
import { UserValidation } from './user.validation.js';
import auth from '../../middlewares/auth.js';
import { Role } from '@prisma/client';

const router = Router();

// Admin: View all users
router.get(
    '/',
    auth(Role.ADMIN),
    UserControllers.getAllUsers,
);

// Get My Profile
router.get(
    '/me',
    auth(Role.ADMIN, Role.MEMBER),
    UserControllers.getMyProfile,
);

// Update My Profile
router.patch(
    '/me',
    auth(Role.ADMIN, Role.MEMBER),
    validateRequest(UserValidation.updateUserValidationSchema),
    UserControllers.updateMyProfile,
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
