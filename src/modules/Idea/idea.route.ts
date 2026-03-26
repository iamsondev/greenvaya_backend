import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { Role } from '../../generated/prisma/enums.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { IdeaControllers } from './idea.controller.js';
import { IdeaValidation } from './idea.validation.js';

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
  // auth is optional here to check if user has paid, but the controller handles undefined user
  auth(Role.ADMIN, Role.MEMBER), 
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
