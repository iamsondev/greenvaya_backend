import { Router } from 'express';

import userRouter from '../modules/User/user.route';
import authRouter from '../modules/Auth/auth.route';
import categoryRouter from '../modules/Category/category.route';
import ideaRouter from '../modules/Idea/idea.route';
import voteRouter from '../modules/Vote/vote.route';
import commentRouter from '../modules/Comment/comment.route';
import paymentRouter from '../modules/Payment/payment.route';

const router = Router();

// Register feature routes here as the app grows
const appRoutes: { path: string; route: Router }[] = [
  { path: '/users', route: userRouter },
  { path: '/auth', route: authRouter },
  { path: '/categories', route: categoryRouter },
  { path: '/ideas', route: ideaRouter },
  { path: '/votes', route: voteRouter },
  { path: '/comments', route: commentRouter },
  { path: '/payments', route: paymentRouter },
];

appRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
