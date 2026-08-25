import 'dotenv/config';
import path from 'path';

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:' + path.join(process.cwd(), 'dev.db'),
});

const prisma = new PrismaClient({ adapter });

const SEED_USERS = [
  {
    email: 'alice@example.com',
    name: 'Alice Johnson',
    subscriptionStatus: 'active' as const,
  },
  {
    email: 'bob@example.com',
    name: 'Bob Smith',
    subscriptionStatus: 'canceled' as const,
  },
  {
    email: 'carol@example.com',
    name: 'Carol Dias',
    subscriptionStatus: null,
  },
];

async function main(): Promise<void> {
  console.log('Seeding users and subscriptions...');

  for (const seedUser of SEED_USERS) {
    const customerId = seedUser.subscriptionStatus
      ? `cus_sandbox_seed_${seedUser.email.replace(/[^a-z0-9]/gi, '')}`
      : null;

    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      create: { email: seedUser.email, stripeCustomerId: customerId },
      update: { stripeCustomerId: customerId },
    });

    await prisma.subscription.deleteMany({
      where: { userId: user.id },
    });

    if (seedUser.subscriptionStatus && customerId) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: seedUser.subscriptionStatus,
          priceId: 'price_sandbox_ignews_monthly',
          stripeCustomerId: customerId,
          stripeSubscriptionId: `sub_sandbox_seed_${user.id}`,
        },
      });
    }

    console.log(`Seeded ${seedUser.name} <${seedUser.email}>`);
  }

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
