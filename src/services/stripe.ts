import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_API_KEY) {
      throw new Error('STRIPE_SECRET_API_KEY is not configured');
    }

    stripeClient = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
      apiVersion: '2026-07-29.dahlia',
      appInfo: {
        name: 'ig.news',
        version: '1.0.0',
      },
    });
  }

  return stripeClient;
}
