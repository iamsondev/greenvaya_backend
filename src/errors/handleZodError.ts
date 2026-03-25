import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../middlewares/globalErrorHandler';

const handleZodError = (err: ZodError) => {
  const statusCode = 400;
  const message = 'Validation Error';
  
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1] || '',
      message: issue.message,
    } as { path: string | number; message: string };
  });

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleZodError;
