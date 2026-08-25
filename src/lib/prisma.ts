import path from 'path';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@/generated/prisma/client';

function resolveDatabaseUrl(): string {
  const rawUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
  const filePath = rawUrl.replace(/^file:/, '');
  // Relative URLs are resolved against the project root,
  // matching the Prisma CLI behavior with prisma.config.ts.
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

const createPrismaClient = () => {
  const adapter = new PrismaBetterSqlite3({ url: resolveDatabaseUrl() });
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrismaClient> };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
