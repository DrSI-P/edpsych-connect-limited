/**
 * Simple logger implementation that's compatible with Edge Runtime
 */
interface LogParams {
  context?: string;
  [key: string]: any;
}

class Logger {
  debug(message: string, params?: LogParams): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, params || {});
    }
  }

  info(message: string, params?: LogParams): void {
    console.info(`[INFO] ${message}`, params || {});
  }

  warn(message: string, params?: LogParams): void {
    logger.warn(`[WARN] ${message}`, params || {});
  }

  error(message: string, params?: LogParams): void {
    logger.error(`[ERROR] ${message}`, params || {});
  }
}

export const logger = new Logger();
