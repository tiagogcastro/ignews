import { sandboxGateway } from './sandbox';
import { stripeGateway } from './stripe';
import { PaymentGateway } from './types';

export function getPaymentGateway(): PaymentGateway {
  const provider = process.env.PAYMENT_PROVIDER
    ?? (process.env.STRIPE_SECRET_API_KEY ? 'stripe' : 'sandbox');

  return provider === 'stripe' && process.env.STRIPE_SECRET_API_KEY
    ? stripeGateway
    : sandboxGateway;
}

export const payments = getPaymentGateway();

export type { CheckoutSessionInput, CheckoutSessionResult, PaymentGateway, PriceInfo, RemoteSubscription } from './types';
