import { prisma } from '../../lib/prisma';
import { stripe } from './payment.utils';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import config from '../../config/index';
import { TCreatePaymentRequest } from './payment.interface';

const createPaymentIntent = async (userId: string, ideaId: string) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

  if (!idea) {
    throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
  }

  if (!idea.isPaid || !idea.price) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This is not a paid idea');
  }

  // Check if already paid
  const existingPayment = await prisma.payment.findUnique({
    where: {
      userId_ideaId: { userId, ideaId },
    },
  });

  if (existingPayment && existingPayment.status === 'SUCCESS') {
    throw new AppError(httpStatus.BAD_REQUEST, 'You have already paid for this idea');
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: idea.title,
            description: `Payment for idea: ${idea.title}`,
          },
          unit_amount: Math.round(idea.price * 100), // Stripe expects cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${config.client_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.client_url}/payment-cancel`,
    customer_email: (await prisma.user.findUnique({ where: { id: userId } }))?.email,
    metadata: {
      userId,
      ideaId,
    } as any,
  });

  // Create pending payment record
  await prisma.payment.upsert({
    where: {
      userId_ideaId: { userId, ideaId },
    },
    create: {
      userId,
      ideaId,
      amount: idea.price,
      status: 'PENDING',
      transactionId: session.id,
    },
    update: {
      status: 'PENDING',
      transactionId: session.id,
    },
  });

  return { 
    id: session.id,
    checkoutUrl: session.url 
  };
};

const verifyPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === 'paid') {
    const { userId, ideaId } = session.metadata as any;

    const result = await prisma.payment.update({
      where: {
        userId_ideaId: { userId, ideaId },
      },
      data: {
        status: 'SUCCESS',
        transactionId: session.id,
        gatewayResponse: session as any,
      },
    });

    return result;
  }

  throw new AppError(httpStatus.BAD_REQUEST, 'Payment not completed');
};

export const PaymentServices = {
  createPaymentIntent,
  verifyPayment,
};
