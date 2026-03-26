import { Router } from 'express';
import auth, { optionalAuth } from '../../middlewares/auth';
import { Role } from '../../generated/prisma/enums';
import validateRequest from '../../middlewares/validateRequest';
import { IdeaControllers } from './idea.controller';
import { IdeaValidation } from './idea.validation';

const router = Router();

// Create idea (Member)
router.post(
  '/',
  auth(Role.MEMBER, Role.ADMIN),
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
  auth(Role.MEMBER, Role.ADMIN),
  validateRequest(IdeaValidation.updateIdeaValidationSchema),
  IdeaControllers.updateIdea,
);

// Admin Action: Approve/Reject
router.patch(
  '/:id/admin-action',
  auth(Role.ADMIN),
  validateRequest(IdeaValidation.adminActionValidationSchema),
  IdeaControllers.adminAction,
);

const ideaRouter = router;
export default ideaRouter;
