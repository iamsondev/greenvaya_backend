import Stripe from 'stripe';
import config from '../../config/index.js';

const stripeSecretKey = config.stripe_secret_key;

if (!stripeSecretKey || stripeSecretKey === 'sk_test_your_stripe_secret_key') {
  console.warn('??  STRIPE_SECRET_KEY is missing or using placeholder. Payment features will not work.');
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_missing_key');
