import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { USER_ROLE } from '../User/user.utils.js';
import { VoteControllers } from './vote.controller.js';

const router = Router();

router.post(
  '/:ideaId',
  auth(USER_ROLE.MEMBER, USER_ROLE.ADMIN, USER_ROLE.MODERATOR),
  VoteControllers.toggleVote,
);

const voteRouter = router;
export default voteRouter;
