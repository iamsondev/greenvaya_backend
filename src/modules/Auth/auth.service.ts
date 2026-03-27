import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../errors/AppError.js';
import { USER_ROLE } from '../User/user.utils.js';
import { createToken, verifyToken } from './auth.utils.js';
import { TLoginUser } from './auth.interface.js';

const registerUser = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const userData = {
    ...payload,
    password: hashedPassword,
    role: USER_ROLE.MEMBER,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  const { password, ...resultWithoutPassword } = result;
  return resultWithoutPassword;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is inactive');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password not matched');
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedPayload;
  try {
    decodedPayload = verifyToken(token, config.jwt_refresh_secret as string);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const { email } = decodedPayload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is inactive');
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
  refreshToken,
};
