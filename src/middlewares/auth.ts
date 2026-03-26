import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/index.js';
import { AppError } from '../errors/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { prisma } from '../lib/prisma.js';
import { Role } from '../generated/prisma/enums.js';

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const { role, id } = decoded;

    // checking if the user is exist
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is already blocked
    if (!user.isActive) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized  hi!',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
