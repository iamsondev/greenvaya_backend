import { Router } from 'express';
import auth from '../../middlewares/auth';
import { Role } from '../../generated/prisma/enums';
import { CommentControllers } from './comment.controller';

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
