import { createHash } from 'crypto';

import {
  CheckoutSessionInput,
  CheckoutSessionResult,
  PaymentGateway,
  PriceInfo,
  RemoteSubscription,
} from './types';

const SANDBOX_PRICE_ID = 'price_sandbox_ignews_monthly';
const SANDBOX_PRICE_CENTS = 1490;

function sandboxCustomerId(email: string): string {
  const hash = createHash('sha256').update(email).digest('hex').slice(0, 16);
  return `cus_sandbox_${hash}`;
}

function sandboxSubscriptionId(customerId: string): string {
  const hash = createHash('sha256').update(`${customerId}:subscription`).digest('hex').slice(0, 16);
  return `sub_sandbox_${hash}`;
}

/**
 * Offline implementation used when Stripe credentials are not configured.
 * It mimics the happy path so the whole app flow works without external services.
 */
export const sandboxGateway: PaymentGateway = {
  async getPrice(): Promise<PriceInfo> {
    return { priceId: SANDBOX_PRICE_ID, unitAmount: SANDBOX_PRICE_CENTS };
  },

  async ensureCustomer({ email, existingCustomerId }): Promise<string> {
    return existingCustomerId ?? sandboxCustomerId(email);
  },

  async createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSessionResult> {
    const sessionId = `cs_sandbox_${Date.now()}`;
    return { sessionId, url: input.successUrl };
  },

  async retrieveSubscription(subscriptionId: string): Promise<RemoteSubscription> {
    return {
      id: subscriptionId.startsWith('sub_sandbox_')
        ? subscriptionId
        : sandboxSubscriptionId(subscriptionId),
      status: 'active',
      priceId: SANDBOX_PRICE_ID,
      customerId: '',
    };
  },
};
