import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { Role } from '@prisma/client';
import { VoteControllers } from './vote.controller.js';

const router = Router();

router.post(
  '/:ideaId',
  auth(Role.MEMBER, Role.ADMIN),
  VoteControllers.toggleVote,
);

const voteRouter = router;
export default voteRouter;
