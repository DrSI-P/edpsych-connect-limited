import { PrismaClient } from '@prisma/client';
import { monitoringService } from './monitoring-service';
import { MetricUnit } from './cloudwatch-config';

/**
 * Database metrics collector for monitoring database performance
 */
export class DatabaseMetricsCollector {
  private isMonitoring: boolean = false;
  private prismaClient: PrismaClient;
  private queryMetrics: Map<string, number[]> = new Map(); // Map of query patterns to execution times
  private slowQueryThreshold: number = 500; // ms
  private monitorInterval: NodeJS.Timeout | null = null;
  private intervalMs: number = 60000; // Default: publish metrics every minute

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  /**
   * Start monitoring database metrics
   * @param intervalMs Interval in milliseconds for publishing aggregated metrics (default: 60000)
   * @param slowQueryThreshold Threshold in milliseconds for slow query detection (default: 500)
   */
  startMonitoring(intervalMs: number = 60000, slowQueryThreshold: number = 500): void {
    if (this.isMonitoring) {
      return;
    }

    this.intervalMs = intervalMs;
    this.slowQueryThreshold = slowQueryThreshold;
    this.isMonitoring = true;
    this.queryMetrics.clear();

    // Set up middleware for query tracking
    this.setupPrismaMiddleware();

    // Set up interval for publishing metrics
    this.monitorInterval = setInterval(() => {
      this.publishAggregatedMetrics().catch(err => {
        console.error('Error publishing database metrics:', err);
      });
    }, this.intervalMs);
  }

  /**
   * Stop monitoring database metrics
   */
  stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    
    this.isMonitoring = false;
    this.removePrismaMiddleware();
  }

  /**
   * Track a database query execution time
   * @param model The database model being queried
   * @param operation The operation being performed (e.g., findMany, update)
   * @param durationMs Query execution time in milliseconds
   */
  trackQuery(model: string, operation: string, durationMs: number): void {
    if (!this.isMonitoring) {
      return;
    }

    const queryPattern = `${model}.${operation}`;
    
    // Store query time for aggregation
    if (!this.queryMetrics.has(queryPattern)) {
      this.queryMetrics.set(queryPattern, []);
    }
    this.queryMetrics.get(queryPattern)?.push(durationMs);

    // Track slow queries immediately
    if (durationMs >= this.slowQueryThreshold) {
      this.trackSlowQuery(model, operation, durationMs);
    }
  }

  /**
   * Track a slow database query
   * @param model The database model being queried
   * @param operation The operation being performed (e.g., findMany, update)
   * @param durationMs Query execution time in milliseconds
   */
  private async trackSlowQuery(model: string, operation: string, durationMs: number): Promise<void> {
    console.warn(`Slow query detected: ${model}.${operation} took ${durationMs}ms`);
    
    await monitoringService.trackDatabaseLatency(operation, model, durationMs);
    
    // Use the appropriate monitoring service method for tracking database errors
    await monitoringService.trackApiError(
      `${model}.${operation}`,
      'SlowQueryError',
      200 // Using 200 since it's not a failed request, just slow
    );
  }

  /**
   * Publish aggregated database metrics
   */
  private async publishAggregatedMetrics(): Promise<void> {
    if (!this.isMonitoring || this.queryMetrics.size === 0) {
      return;
    }

    try {
      // Track connection metrics if available
      await this.trackConnectionPoolMetrics();

      // Process and publish query metrics
      for (const [queryPattern, durations] of this.queryMetrics.entries()) {
        if (durations.length === 0) {
          continue;
        }

        // Calculate metrics
        const avgDuration = durations.reduce((sum, val) => sum + val, 0) / durations.length;
        const maxDuration = Math.max(...durations);
        const [model, operation] = queryPattern.split('.');

        // Publish metrics
        await monitoringService.trackDatabaseLatency(
          operation,
          model,
          avgDuration
        );

        // Track database query latency which will use CloudWatch metrics internally
        await monitoringService.trackDatabaseLatency(
          operation,
          model,
          maxDuration
        );

        // Track activity for database queries
        await monitoringService.trackUserActivity(
          'DatabaseQuery',
          `${model}.${operation}`,
          durations.length
        );
      }

      // Clear metrics for next interval
      this.queryMetrics.clear();
    } catch (error) {
      console.error('Error publishing database metrics:', error);
    }
  }

  /**
   * Track database connection pool metrics
   */
  private async trackConnectionPoolMetrics(): Promise<void> {
    try {
      // For Prisma, we need to use internal properties to access connection pool info
      // This is not officially supported, so we need to handle potential changes in Prisma's API
      const prismaAny = this.prismaClient as any;
      
      if (prismaAny._engine?.metrics) {
        const metrics = await prismaAny._engine.metrics();
        
        if (metrics) {
          // Extract connection metrics if available
          const activeConnections = metrics.active_connections || 0;
          const idleConnections = metrics.idle_connections || 0;
          const totalConnections = activeConnections + idleConnections;
          
          // Use resource tracking for database connection metrics
          await monitoringService.trackResourceUsage(
            'DatabaseConnections',
            totalConnections,
            MetricUnit.COUNT
          );
          
          // Treat active connections as a resource metric
          await monitoringService.trackResourceUsage(
            'DatabaseConnectionsActive',
            activeConnections,
            MetricUnit.COUNT
          );
          
          // Track idle connections
          await monitoringService.trackResourceUsage(
            'DatabaseConnectionsIdle',
            idleConnections,
            MetricUnit.COUNT
          );
          
          // Calculate connection pool utilization percentage
          if (metrics.max_connections && metrics.max_connections > 0) {
            const utilizationPercentage = (totalConnections / metrics.max_connections) * 100;
            await monitoringService.trackResourceUsage(
              'DatabaseConnectionPoolUtilization',
              utilizationPercentage,
              MetricUnit.PERCENT
            );
          }
        }
      }
    } catch (error) {
      console.error('Error tracking connection pool metrics:', error);
    }
  }

  /**
   * Setup Prisma middleware for query tracking
   */
  private setupPrismaMiddleware(): void {
    this.prismaClient.$use(async (params, next) => {
      const startTime = Date.now();
      
      try {
        const result = await next(params);
        const durationMs = Date.now() - startTime;
        
        // Track query metrics
        this.trackQuery(params.model || 'unknown', params.action, durationMs);
        
        return result;
      } catch (error) {
        const durationMs = Date.now() - startTime;
        
        // Track failed query
        await monitoringService.trackApiError(
          'database', 
          error instanceof Error ? error.name : 'DatabaseError',
          500
        );
        
        throw error;
      }
    });
  }

  /**
   * Remove Prisma middleware
   * Note: Prisma doesn't officially support removing middleware,
   * so this is a best-effort implementation
   */
  private removePrismaMiddleware(): void {
    // Not officially supported by Prisma
    // Just a placeholder in case future Prisma versions support this
  }
}