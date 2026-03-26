export type TPayment = {
  amount: number;
  currency?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  userId: string;
  ideaId: string;
};

export type TCreatePaymentRequest = {
  ideaId: string;
};

export type TVerifyPaymentRequest = {
  sessionId: string;
};
