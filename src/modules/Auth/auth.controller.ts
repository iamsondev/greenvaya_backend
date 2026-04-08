import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { AuthServices } from './auth.service.js';
import { OAuth2Client } from 'google-auth-library';
import config from '../../config/index.js';

const client = new OAuth2Client(
  config.google_client_id as string,
  config.google_client_secret as string,
  config.google_callback_url as string,
);


const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully',
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully',
    data: null,
  });
});
const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: config.google_client_id as string,
    redirect_uri: config.google_callback_url as string,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'select_account',
  })}`;

  res.redirect(authUrl);
});

const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    throw new Error('Authorization code not found');
  }

  const { tokens } = await client.getToken({
    code: code as string,
    redirect_uri: config.google_callback_url as string,
  });

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token as string,
    audience: config.google_client_id as string,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error('Invalid Google token payload');
  }

  const result = await AuthServices.googleLogin({
    email: payload.email,
    name: payload.name as string,
    profileImage: payload.picture,
  });


  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  const frontendURL = config.frontend_url || 'http://localhost:3000';
  res.redirect(`${frontendURL}/auth/google/callback?token=${accessToken}`);
});

export const AuthControllers = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  googleAuth,
  googleCallback,
};