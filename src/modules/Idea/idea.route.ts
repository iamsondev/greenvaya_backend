import { Router } from 'express';
import auth, { optionalAuth } from '../../middlewares/auth.js';
import { USER_ROLE } from '../User/user.utils.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { IdeaControllers } from './idea.controller.js';
import { IdeaValidation } from './idea.validation.js';

const router = Router();

// Create idea (Member)
router.post(
  '/',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  validateRequest(IdeaValidation.createIdeaValidationSchema),
  IdeaControllers.createIdea,
);

// Get all ideas (Public with optional filters)
router.get(
  '/',
  IdeaControllers.getAllIdeas,
);

// Get single idea (Public, handles paid logic)
router.get(
  '/:id',
  optionalAuth,
  IdeaControllers.getSingleIdea,
);

// Update idea (Owner only)
router.patch(
  '/:id',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  validateRequest(IdeaValidation.updateIdeaValidationSchema),
  IdeaControllers.updateIdea,
);

// Delete idea (Owner if unpublished / Admin any)
router.delete(
  '/:id',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  IdeaControllers.deleteIdea,
);

// Submit Draft for Review (Owner only)
router.patch(
  '/:id/submit',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  IdeaControllers.submitIdea,
);

// Admin Action: Approve/Reject
router.patch(
  '/:id/admin-action',
  auth(USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  validateRequest(IdeaValidation.adminActionValidationSchema),
  IdeaControllers.adminAction,
);

const ideaRouter = router;
export default ideaRouter;
