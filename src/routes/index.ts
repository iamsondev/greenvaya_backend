import { Router } from 'express';

const router = Router();

// Register feature routes here as the app grows
// Example:
// import userRouter from '../modules/user/user.route';
// router.use('/users', userRouter);

const appRoutes: { path: string; route: Router }[] = [
  // { path: '/users', route: userRouter },
];

appRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
