import { prisma } from '@/lib/prisma';
import { payments } from '@/services/payments';

/**
 * Keeps the local Subscription row in sync with the remote payment provider.
 * Upserting by stripeSubscriptionId makes repeated webhook deliveries converge.
 */
export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
): Promise<void> {
  const remoteSubscription = await payments.retrieveSubscription(subscriptionId);

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    throw new Error(`No user found for stripe customer ${customerId}`);
  }

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: remoteSubscription.id },
    create: {
      userId: user.id,
      status: remoteSubscription.status,
      priceId: remoteSubscription.priceId || null,
      stripeCustomerId: customerId,
      stripeSubscriptionId: remoteSubscription.id,
    },
    update: {
      userId: user.id,
      status: remoteSubscription.status,
      priceId: remoteSubscription.priceId || null,
    },
  });
}
