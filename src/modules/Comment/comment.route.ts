import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../User/user.utils.js';
import { CommentControllers } from './comment.controller.js';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  CommentControllers.createComment,
);

router.delete(
  '/:id',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  CommentControllers.deleteComment,
);

const commentRouter = router;
export default commentRouter;
