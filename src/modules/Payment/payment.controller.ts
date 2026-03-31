import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { PaymentServices } from './payment.service.js';
import { TCreatePaymentRequest } from './payment.interface.js';

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { ideaId } = req.body as TCreatePaymentRequest;

  const result = await PaymentServices.createPaymentIntent(userId, ideaId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checkout session created successfully',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.query.session_id || req.query.sessionId;

  const result = await PaymentServices.verifyPayment(sessionId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment verified successfully',
    data: result,
  });
});
const getUserPurchases = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await PaymentServices.getUserPurchases(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchases retrieved successfully',
    data: result,
  });
});
const checkPurchase = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id
  const { ideaId } = req.params
  const result = await PaymentServices.checkUserPurchase(userId, ideaId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase status checked',
    data: { hasPurchased: result },
  })
})

export const PaymentControllers = {
  createCheckoutSession,
  verifyPayment,
  getUserPurchases,
  checkPurchase,
};
