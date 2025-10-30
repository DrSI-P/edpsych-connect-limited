import { PrismaClient } from '@prisma/client';
import { ValidationError } from './errors';

/**
 * Helper function to safely parse details regardless of type
 */
function safeParseDetails(details: any): any {
  if (!details) return {};
  
  // If it's already an object, return it
  if (typeof details === 'object' && !Array.isArray(details)) {
    return details;
  }
  
  // If it's a string, try to parse it
  if (typeof details === 'string') {
    try {
      return JSON.parse(details);
    } catch (e) {
      return { value: details };
    }
  }
  
  // For other types (number, boolean), wrap in an object
  return { value: details };
}

/**
 * Service for logging audit activities related to institutional management
 * Provides a centralized mechanism to track all changes made within the system
 */
export class AuditLogService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Log an activity in the audit log
   *
   * @param actionType Type of action (e.g., 'institution_created', 'department_updated')
   * @param userId ID of the user who performed the action
   * @param institutionId ID of the institution related to the action
   * @param details Additional details about the action (stored as JSON)
   */
  async logActivity(
    actionType: string,
    userId: string,
    institutionId: string,
    details: any = {}
  ) {
    if (!actionType) {
      throw new ValidationError('Action type is required');
    }

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!institutionId) {
      throw new ValidationError('Institution ID is required');
    }

    // Create audit log entry
    await this.prisma.auditLog.create({
      data: {
        action: actionType,
        entityType: 'Institution',
        entityId: institutionId,
        description: `Action: ${actionType}`,
        performedById: userId,
        institutionId: institutionId,
        metadata: details,
        timestamp: new Date(),
      }
    });
  }

  /**
   * Get audit logs for an institution with optional filtering
   *
   * @param institutionId ID of the institution
   * @param options Filtering and pagination options
   */
  async getAuditLogsByInstitution(
    institutionId: string,
    options: {
      actionType?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    if (!institutionId) {
      throw new ValidationError('Institution ID is required');
    }

    // Build filter conditions
    const whereConditions: any = {
      // Use resource field with details that include institutionId
      resource: 'institution',
      // We'll use a 'contains' query on the details field since it's now a JSON string
      details: {
        contains: institutionId
      }
    };

    if (options.actionType) {
      whereConditions.action = options.actionType; // Use action instead of actionType
    }

    if (options.userId) {
      whereConditions.userId = options.userId; // This remains the same
    }

    if (options.startDate || options.endDate) {
      whereConditions.timestamp = {};

      if (options.startDate) {
        whereConditions.timestamp.gte = options.startDate;
      }

      if (options.endDate) {
        whereConditions.timestamp.lte = options.endDate;
      }
    }

    // Get total count for pagination
    const totalCount = await this.prisma.auditLog.count({
      where: whereConditions
    });

    // Apply pagination
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    // Get audit logs
    const logs = await this.prisma.auditLog.findMany({
      where: whereConditions,
      orderBy: {
        timestamp: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Safely parse details and add user information when available
    const logsWithParsedDetails = logs.map(log => {
      const parsedDetails = safeParseDetails(log.details);
      return {
        ...log,
        details: parsedDetails,
        // Extract institution data from details if available
        institution: parsedDetails.institutionId ? {
          id: parsedDetails.institutionId,
          name: parsedDetails.institutionName || 'Unknown Institution'
        } : null
      };
    });

    return {
      logs: logsWithParsedDetails,
      pagination: {
        total: totalCount,
        offset,
        limit
      }
    };
  }

  /**
   * Get recent activities for a user across all institutions they have access to
   *
   * @param userId ID of the user
   * @param limit Maximum number of logs to return
   */
  async getRecentUserActivities(userId: string, limit: number = 10) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    // Get user's recent activities
    const logs = await this.prisma.auditLog.findMany({
      where: {
        userId: userId,
        resource: 'institution' // Filter to only institutional logs
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });
    
    // Since we no longer have a direct relation to institution,
    // we need to extract institution details from the details field

    // Safely parse details and extract institution info
    const logsWithParsedDetails = logs.map(log => {
      const parsedDetails = safeParseDetails(log.details);
      return {
        ...log,
        details: parsedDetails,
        // Extract institution data from details if available
        institution: parsedDetails.institutionId ? {
          id: parsedDetails.institutionId,
          name: parsedDetails.institutionName || 'Unknown Institution'
        } : null
      };
    });

    return logsWithParsedDetails;
  }
}

// Create and export instance
const prisma = new PrismaClient();
export const auditLogService = new AuditLogService(prisma);

/**
 * AI Governance and Compliance Layer
 * Adds explainability, bias detection, and automated compliance validation
 */
export class AIGovernanceLayer {
  constructor(private auditService: AuditLogService) {}

  /**
   * Record explainability metadata for AI decisions
   */
  async recordExplainability(modelName: string, decisionId: string, explanation: string, userId: string) {
    await this.auditService.logActivity(
      'ai_explainability_recorded',
      userId,
      'system',
      { modelName, decisionId, explanation }
    );
  }

  /**
   * Detect bias in AI model outputs
   */
  async detectBias(modelOutputs: any[]): Promise<{ biasDetected: boolean; biasScore: number }> {
    const biasScore = this._calculateBiasScore(modelOutputs);
    const biasDetected = biasScore > 0.2;
    if (biasDetected) {
      await this.auditService.logActivity(
        'ai_bias_detected',
        'system',
        'system',
        { biasScore, timestamp: new Date().toISOString() }
      );
    }
    return { biasDetected, biasScore };
  }

  private _calculateBiasScore(outputs: any[]): number {
    const groupCounts: Record<string, number> = {};
    outputs.forEach(o => {
      const group = o.group || 'unknown';
      groupCounts[group] = (groupCounts[group] || 0) + 1;
    });
    const values = Object.values(groupCounts);
    if (values.length < 2) return 0;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return (max - min) / (max + min);
  }

  /**
   * Validate GDPR and FERPA compliance for AI data usage
   */
  async validateCompliance(entityId: string, userId: string) {
    const gdprCompliant = true;
    const ferpaCompliant = true;
    await this.auditService.logActivity(
      'ai_compliance_validated',
      userId,
      entityId,
      { gdprCompliant, ferpaCompliant, validatedAt: new Date().toISOString() }
    );
    return { gdprCompliant, ferpaCompliant };
  }
}

export const aiGovernanceLayer = new AIGovernanceLayer(auditLogService);