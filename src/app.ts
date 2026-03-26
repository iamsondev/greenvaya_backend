import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import router from './routes/index';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from greenvaya world');
});
app.use(globalErrorHandler);
app.use(notFound)
export default app;
