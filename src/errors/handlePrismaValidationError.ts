import { TErrorSources, TGenericErrorResponse } from '../interface/error.Interface';

const handlePrismaValidationError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;
  const message = 'Prisma Validation Error';
  const errorSources: TErrorSources = [
    {
      path: '',
      message: err.message,
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaValidationError;
