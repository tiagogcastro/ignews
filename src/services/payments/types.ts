import Stripe from 'stripe';

export type PriceInfo = {
  priceId: string;
  unitAmount: number | null;
};

export type RemoteSubscription = {
  id: string;
  status: Stripe.Subscription.Status;
  priceId: string;
  customerId: string;
};

export type CheckoutSessionInput = {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSessionResult = {
  sessionId: string;
  url: string | null;
};

export interface PaymentGateway {
  getPrice(priceId: string): Promise<PriceInfo>;
  ensureCustomer(input: { email: string; existingCustomerId?: string }): Promise<string>;
  createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSessionResult>;
  retrieveSubscription(subscriptionId: string): Promise<RemoteSubscription>;
}
