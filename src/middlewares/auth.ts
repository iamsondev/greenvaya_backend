import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/index.js';
import { AppError } from '../errors/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { prisma } from '../lib/prisma.js';
import { Role } from '@prisma/client';

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // Header অথবা Cookie — যেকোনো একটা থেকে token নাও
    let token = req.headers.authorization || req.cookies?.accessToken;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Bearer prefix handle
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

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

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    if (!user.isActive) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }


    req.user = decoded as JwtPayload;
    next();
  });
};

export const optionalAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // ✅ Header অথবা Cookie
  let token = req.headers.authorization || req.cookies?.accessToken;

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (user && user.isActive) {
        req.user = decoded;
      }
    } catch (err) {
      // Ignore invalid tokens for optional auth
    }
  }

  next();
});

export default auth;
