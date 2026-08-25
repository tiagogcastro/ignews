import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

import { ApiError, ok, parseWith, withErrorHandling } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { payments } from '@/services/payments';
import { saveSubscription } from '@/services/subscriptions';

const bodySchema = z.object({}).strict();

const DEFAULT_SUCCESS_URL = 'http://localhost:3000/posts';
const DEFAULT_CANCEL_URL = 'http://localhost:3000';
const SANDBOX_PRICE_ID = 'price_sandbox_ignews_monthly';

async function subscribeHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    throw new ApiError(405, 'Method not allowed');
  }

  const session = await getSession({ req: request });
  const email = session?.user?.email;

  if (!email) {
    throw new ApiError(401, 'Authentication required');
  }

  parseWith(bodySchema, request.body ?? {});

  const user = await prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  const customerId = await payments.ensureCustomer({
    email,
    existingCustomerId: user.stripeCustomerId ?? undefined,
  });

  if (customerId !== user.stripeCustomerId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await payments.createCheckoutSession({
    customerId,
    priceId: process.env.STRIPE_PRICE_ID || SANDBOX_PRICE_ID,
    successUrl: process.env.STRIPE_SUCCESS_URL || DEFAULT_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL || DEFAULT_CANCEL_URL,
  });

  // Without real Stripe there is no webhook to activate the plan,
  // so the sandbox gateway completes the checkout synchronously.
  if (payments.id === 'sandbox') {
    await saveSubscription(`sub_sandbox_${customerId}`, customerId);
  }

  ok(response, { sessionId: checkoutSession.sessionId, url: checkoutSession.url });
}

export default withErrorHandling(subscribeHandler);
