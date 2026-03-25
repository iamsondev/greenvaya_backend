import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client';
import AppError from '../errors/AppError';
import handleZodError from '../errors/handleZodError';
import handlePrismaError from '../errors/handlePrismaError';

export type TErrorSources = {
  path: string | number;
  message: string;
}[];

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    const simplifiedError = handlePrismaError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  // send response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
