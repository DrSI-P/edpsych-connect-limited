import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

/**
 * Singleton Prisma client instance
 * Used to interact with the database throughout the application
 */

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';

// Create a global variable to store the prisma instance
declare global {
   
  const prisma: PrismaClient | undefined;
}

// Initialize Prisma Client with logging options
function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: isProduction
      ? ['error'] // Only log errors in production
      : ['query', 'error', 'warn'], // More verbose in development
  });

  // Add custom logging middleware only if $use is available
  if (typeof client.$use === 'function') {
    client.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      const executionTime = after - before;

      // Log slow queries (taking more than 100ms)
      if (executionTime > 100) {
        logger.warn(`Slow query detected (${executionTime}ms)`, {
          model: params.model,
          action: params.action,
          executionTime,
        });
      }

      // Log all database operations in debug mode
      logger.debug(`Prisma query: ${params.model}.${params.action}`, {
        model: params.model,
        action: params.action,
        executionTime,
      });

      return result;
    });
  } else {
    logger.warn('⚠️ Prisma middleware ($use) not available in this environment.');
  }

  return client;
}

// Export a singleton Prisma client instance
export const prisma = global.prisma || createPrismaClient();

// In development, we want to use a global variable so that the connection
// is maintained across hot reloads
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Safely handles a Prisma operation with proper error handling
 *
 * @param operation - Function that performs a Prisma operation
 * @param errorMessage - Custom error message for logging
 * @returns The result of the operation
 */
export async function prismaOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const err = error as Error;
    logger.error(`${errorMessage}: ${err.message}`, {
      stack: err.stack,
    });

    // Rethrow with a more user-friendly message
    throw new Error(`Database operation failed: ${errorMessage}`);
  }
}

/**
 * Initialize database connection and verify connectivity
 * Useful for startup health checks
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Test connection by querying a simple value
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established successfully');
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to connect to database: ${err.message}`, {
      stack: err.stack,
    });
    throw new Error('Database connection failed');
  }
}
