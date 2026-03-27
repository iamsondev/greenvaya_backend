import {
  TErrorSources,
  TGenericErrorResponse,
} from '../interface/error.Interface.js';

const handlePrismaValidationError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;
  const message = 'Validation Error';

  // Extracting the specific error message by splitting the lines and taking the last relevant part
  const errMessage = err.message.split('\n').pop()?.trim() || err.message;

  // Attempting to extract the path (field name) from the error message (e.g., from `data`)
  const pathMatch = err.message.match(/`(.+?)`/);
  const path = pathMatch ? pathMatch[1] : '';

  const errorSources: TErrorSources = [
    {
      path: path,
      message: errMessage,
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaValidationError;
