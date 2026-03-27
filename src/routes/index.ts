import { Router } from 'express';

import userRouter from '../modules/User/user.route.js';
import authRouter from '../modules/Auth/auth.route.js';
import categoryRouter from '../modules/Category/category.route.js';
import ideaRouter from '../modules/Idea/idea.route.js';
import voteRouter from '../modules/Vote/vote.route.js';
import commentRouter from '../modules/Comment/comment.route.js';
import paymentRouter from '../modules/Payment/payment.route.js';

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
