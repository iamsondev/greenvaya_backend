import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { Role } from '../../generated/prisma/enums.js';
import { CommentControllers } from './comment.controller.js';

const router = Router();

router.post(
  '/',
  auth(Role.MEMBER, Role.ADMIN),
  CommentControllers.createComment,
);

router.delete(
  '/:id',
  auth(Role.MEMBER, Role.ADMIN),
  CommentControllers.deleteComment,
);

const commentRouter = router;
export default commentRouter;
