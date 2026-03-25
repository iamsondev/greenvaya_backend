import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interface/error.Interface';

const handlePrismaError = (
  err:
    | Prisma.PrismaClientValidationError
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientInitializationError
): TGenericErrorResponse => {
  let statusCode = 400;
  let message = 'Prisma Error';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong with Prisma',
    },
  ];

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Prisma Validation Error';
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 400;
      message = 'Duplicate Entry';
      // Prisma puts the duplicate fields in err.meta.target
      let duplicateFields = '';
      if (err.meta && err.meta.target) {
        duplicateFields = Array.isArray(err.meta.target)
          ? err.meta.target.join(', ')
          : (err.meta.target as string);
      }
      
      errorSources = [
        {
          path: duplicateFields,
          message: `${duplicateFields ? duplicateFields + ' ' : ''}already exists`,
        },
      ];
    } else {
      statusCode = 400;
      message = 'Prisma Known Request Error';
      errorSources = [
        {
          path: '',
          message: err.message,
        },
      ];
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Prisma Initialization Error';
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaError;
