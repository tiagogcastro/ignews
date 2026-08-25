import { z } from 'zod';

import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

import { prisma } from '@/lib/prisma';
import { NextAuthOptions } from 'next-auth';

const githubConfigured = Boolean(
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
);

const devLoginEnabled =
  process.env.AUTH_DEV_LOGIN === 'true' ||
  (!githubConfigured && process.env.NODE_ENV !== 'production');

const devEmailSchema = z.string().email();

export const authOptions: NextAuthOptions = {
  providers: [
    ...(githubConfigured
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
            authorization: {
              params: {
                scope: 'read:user',
              },
            },
          }),
        ]
      : []),
    ...(devLoginEnabled
      ? [
          CredentialsProvider({
            id: 'dev',
            name: 'Development Login',
            credentials: {
              email: { label: 'Email', type: 'email' },
            },
            async authorize(credentials) {
              const parsed = devEmailSchema.safeParse(credentials?.email);
              if (!parsed.success) {
                return null;
              }

              return { id: parsed.data, email: parsed.data, name: 'Dev User' };
            },
          }),
        ]
      : []),
  ],
  secret: process.env.SIGNING_KEY ?? 'development-only-signing-key',
  callbacks: {
    async signIn({ user }) {
      const email = user.email;

      if (!email) {
        return false;
      }

      try {
        await prisma.user.upsert({
          where: { email },
          create: { email },
          update: {},
        });
        return true;
      } catch (error) {
        console.error('[auth] failed to persist user:', error);
        return false;
      }
    },
    async session({ session }) {
      const email = session.user?.email;

      const activeSubscription = email
        ? await prisma.subscription.findFirst({
            where: {
              status: 'active',
              user: { email },
            },
            select: { id: true, status: true },
          })
        : null;

      return { ...session, activeSubscription };
    },
  },
};
