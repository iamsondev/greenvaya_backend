import { Router } from 'express';
import auth, { optionalAuth } from '../../middlewares/auth.js';
import { Role } from '@prisma/client';
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

// Delete idea (Owner if unpublished / Admin any)
router.delete(
  '/:id',
  auth(Role.MEMBER, Role.ADMIN),
  IdeaControllers.deleteIdea,
);

// Submit Draft for Review (Owner only)
router.patch(
  '/:id/submit',
  auth(Role.MEMBER, Role.ADMIN),
  IdeaControllers.submitIdea,
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
