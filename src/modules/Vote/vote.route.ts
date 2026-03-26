import { Router } from 'express';
import auth from '../../middlewares/auth';
import { Role } from '../../generated/prisma/enums';
import { VoteControllers } from './vote.controller';

const router = Router();

router.post(
  '/:ideaId',
  auth(Role.MEMBER, Role.ADMIN),
  VoteControllers.toggleVote,
);

const voteRouter = router;
export default voteRouter;
