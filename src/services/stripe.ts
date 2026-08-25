import Stripe from 'stripe';

const STRIPE_API_VERSION = '2026-07-29.dahlia';

let stripeClient: Stripe | null = null;
let webhookClient: Stripe | null = null;

function createClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
    appInfo: {
      name: 'ig.news',
      version: '1.0.0',
    },
  });
}

export function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_API_KEY) {
      throw new Error('STRIPE_SECRET_API_KEY is not configured');
    }

    stripeClient = createClient(process.env.STRIPE_SECRET_API_KEY);
  }

  return stripeClient;
}

/**
 * Signature verification happens locally and never hits the network,
 * so this client works even without a configured api key.
 */
export function getStripeWebhooks(): Stripe {
  if (!webhookClient) {
    webhookClient = createClient(
      process.env.STRIPE_SECRET_API_KEY || 'webhook_verification_only',
    );
  }

  return webhookClient;
}
