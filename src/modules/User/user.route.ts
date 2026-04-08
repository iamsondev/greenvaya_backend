import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { UserControllers } from './user.controller.js';
import { UserValidation } from './user.validation.js';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from './user.utils.js';

const router = Router();

// Admin: View all users
router.get(
    '/',
    auth(USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
    UserControllers.getAllUsers,
);

// Get My Profile
router.get(
    '/me',
    auth(USER_ROLE.ADMIN, USER_ROLE.MODERATOR, USER_ROLE.MEMBER),
    UserControllers.getMyProfile,
);

// Update My Profile
router.patch(
    '/me',
    auth(USER_ROLE.ADMIN, USER_ROLE.MODERATOR, USER_ROLE.MEMBER),
    validateRequest(UserValidation.updateUserValidationSchema),
    UserControllers.updateMyProfile,
);

// Admin/Owner: View single user
router.get(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.MODERATOR, USER_ROLE.MEMBER),
    UserControllers.getSingleUser,
);

// Admin: Update user (role, status)
router.patch(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
    validateRequest(UserValidation.updateUserValidationSchema),
    UserControllers.updateUser,
);

const userRouter = router;
export default userRouter;
