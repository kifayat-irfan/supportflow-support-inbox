
import { PrismaClient } from '@prisma/client';

// Use globalThis instead of global to avoid "Cannot find name 'global'" errors in certain environments (like Next.js)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
