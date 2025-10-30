// Redis configuration with edge runtime compatibility

export interface RateLimiter {
  isAllowed: (key: string, limit: number, window: number) => Promise<boolean>;
}
