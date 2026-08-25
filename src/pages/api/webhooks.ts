import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { z } from 'zod';

import { ApiError, fail, ok, parseWith, withErrorHandling } from '@/lib/api';
import { getStripeWebhooks } from '@/services/stripe';
import { saveSubscription } from '@/services/subscriptions';

export const config = {
  api: {
    bodyParser: false,
  },
};

const signatureSchema = z.string().min(1);

async function buffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

const relevantEvents = new Set<Stripe.Event.Type>([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

async function webhooksHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    throw new ApiError(405, 'Method not allowed');
  }

  const buf = await buffer(request);

  const rawSignature = request.headers['stripe-signature'];
  if (!rawSignature) {
    throw new ApiError(400, 'Missing stripe-signature header');
  }
  const signature = parseWith(signatureSchema, rawSignature);

  let event: Stripe.Event;

  try {
    event = getStripeWebhooks().webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid payload';
    fail(response, 400, `Webhook error: ${message}`);
    return;
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          await saveSubscription(
            String(checkoutSession.subscription),
            String(checkoutSession.customer),
          );
          break;
        }

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;

          await saveSubscription(
            subscription.id,
            String(subscription.customer),
          );
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.error('[webhooks] handler failed:', error);
      fail(response, 500, 'Webhook handler failed');
      return;
    }
  }

  ok(response, { received: true });
}

export default withErrorHandling(webhooksHandler);
