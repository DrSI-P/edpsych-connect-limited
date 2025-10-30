import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

let prisma: PrismaClient;

try {
  // Use a global singleton in dev to avoid hot-reload issues
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;

  // Guard against missing $use or engine binding issues
  if (typeof prisma.$use === 'function') {
    prisma.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      const duration = after - before;
      if (duration > 200) {
        logger.warn(`Slow query (${duration}ms): ${params.model}.${params.action}`);
      }
      return result;
    });
  } else {
    logger.warn('⚠️ Prisma middleware ($use) not available in this environment.');
  }
} catch (err) {
  logger.error('❌ Prisma client failed to initialize. Database connectivity required for production.', err);
  throw new Error('Critical: Prisma client initialization failed. Check DATABASE_URL and Prisma configuration.');
}

export default prisma;