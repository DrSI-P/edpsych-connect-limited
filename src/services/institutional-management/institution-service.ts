import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { NotFoundError, ValidationError, AccessDeniedError } from './errors';
import { generateId } from '../../utils/id-generator';
import { 
  InstitutionType, 
  InstitutionSize, 
  VerificationStatus,
  Institution,
  User,
  UserRole,
  AuditLog
} from './types';

export interface CreateInstitutionInput {
  name: string;
  type: InstitutionType;
  size: InstitutionSize;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email: string;
  website?: string;
  logoUrl?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface UpdateInstitutionInput {
  name?: string;
  type?: InstitutionType;
  size?: InstitutionSize;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  isActive?: boolean;
  verificationStatus?: VerificationStatus;
  verifiedAt?: Date | null;
}

export interface InstitutionQueryOptions {
  includeInactive?: boolean;
  verificationStatus?: VerificationStatus[];
  type?: InstitutionType[];
  size?: InstitutionSize[];
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Service for managing institutions
 */
export class InstitutionService {
  /**
   * Create a new institution
   */
  async createInstitution(data: CreateInstitutionInput, userId: string): Promise<Institution> {
    try {
      this.validateInstitutionInput(data);
      
      // Generate a unique ID for the institution
      const institutionId = generateId('inst');

      // Create the institution
      const institution = await prisma.institution.create({
        data: {
          id: institutionId,
          name: data.name,
          type: data.type as unknown as string,
          size: data.size as unknown as string,
          address: data.address,
          city: data.city,
          region: data.region,
          postcode: data.postalCode,
          country: data.country,
          phone: data.phone,
          email: data.email,
          website: data.website,
          logoUrl: data.logoUrl,
          notes: data.notes,
          tags: data.tags,
          customFields: data.customFields,
          verificationStatus: VerificationStatus.PENDING as string,
          isActive: true,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Log the creation
      await this.logAuditEvent({
        action: 'INSTITUTION_CREATED',
        entityType: 'Institution',
        entityId: institution.id,
        description: `Institution "${institution.name}" created`,
        performedById: userId,
        institutionId: institution.id,
      });

      return institution as unknown as Institution;
    } catch (error) {
      logger.error('Error creating institution', { error, data });
      throw error;
    }
  }

  /**
   * Get an institution by ID
   */
  async getInstitutionById(institutionId: string, userId: string): Promise<Institution> {
    try {
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
        include: {
          departments: true,
          contacts: {
            where: { isPrimaryContact: true },
            take: 5,
          },
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { startDate: 'desc' },
            take: 1,
          },
        },
      });

      if (!institution) {
        throw new NotFoundError(`Institution with ID ${institutionId} not found`);
      }

      // Check if user has access to this institution
      await this.verifyInstitutionAccess(userId, institutionId);

      return institution as unknown as Institution;
    } catch (error) {
      logger.error('Error fetching institution', { error, institutionId });
      throw error;
    }
  }

  /**
   * Get a list of institutions with filtering, sorting, and pagination
   */
  async getInstitutions(options: InstitutionQueryOptions, userId: string): Promise<{ data: Institution[]; total: number; page: number; limit: number }> {
    try {
      // Default values
      const page = options.page || 1;
      const limit = options.limit || 20;
      const skip = (page - 1) * limit;
      
      // Build where clause
      const where: any = {};
      
      // Only include active institutions by default
      if (!options.includeInactive) {
        where.isActive = true;
      }
      
      // Filter by verification status if provided
      if (options.verificationStatus && options.verificationStatus.length > 0) {
        where.verificationStatus = { in: options.verificationStatus };
      }
      
      // Filter by type if provided
      if (options.type && options.type.length > 0) {
        where.type = { in: options.type };
      }
      
      // Filter by size if provided
      if (options.size && options.size.length > 0) {
        where.size = { in: options.size };
      }
      
      // Search term
      if (options.searchTerm) {
        where.OR = [
          { name: { contains: options.searchTerm, mode: 'insensitive' } },
          { email: { contains: options.searchTerm, mode: 'insensitive' } },
          { city: { contains: options.searchTerm, mode: 'insensitive' } },
        ];
      }
      
      // Verify user has permission to view institutions
      await this.verifyInstitutionListAccess(userId);
      
      // Get institutions
      const institutions = await prisma.institution.findMany({
        where,
        include: {
          _count: {
            select: {
              departments: true,
              contacts: true,
              users: true,
            },
          },
          subscriptions: {
            where: { status: 'ACTIVE' },
            select: { plan: true },
            take: 1,
          },
        },
        orderBy: options.sortBy 
          ? { [options.sortBy]: options.sortDirection || 'asc' }
          : { createdAt: 'desc' },
        skip,
        take: limit,
      });
      
      // Get total count
      const total = await prisma.institution.count({ where });
      
      return {
        data: institutions as unknown as Institution[],
        total,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Error fetching institutions', { error, options });
      throw error;
    }
  }

  /**
   * Update an institution
   */
  async updateInstitution(institutionId: string, userId: string, data: UpdateInstitutionInput): Promise<Institution> {
    try {
      // Check if institution exists
      const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
      
      if (!institution) {
        throw new NotFoundError(`Institution with ID ${institutionId} not found`);
      }
      
      // Verify user has permission to update this institution
      await this.verifyInstitutionUpdateAccess(userId, institutionId);
      
      // Update the institution
      const updatedInstitution = await prisma.institution.update({
        where: { id: institutionId },
        data: {
          name: data.name,
          type: data.type ? (data.type as unknown as string) : undefined,
          size: data.size ? (data.size as unknown as string) : undefined,
          address: data.address,
          city: data.city,
          region: data.region,
          postcode: data.postalCode,
          country: data.country,
          phone: data.phone,
          email: data.email,
          website: data.website,
          logoUrl: data.logoUrl,
          notes: data.notes,
          tags: data.tags,
          customFields: data.customFields,
          isActive: data.isActive,
          verificationStatus: data.verificationStatus ? (data.verificationStatus as string) : undefined,
          verifiedAt: data.verifiedAt,
          updatedAt: new Date(),
        },
      });
      
      // Log the update
      await this.logAuditEvent({
        action: 'INSTITUTION_UPDATED',
        entityType: 'Institution',
        entityId: institutionId,
        description: `Institution "${updatedInstitution.name}" updated`,
        performedById: userId,
        institutionId: institutionId,
        metadata: { updatedFields: Object.keys(data) },
      });
      
      return updatedInstitution as unknown as Institution;
    } catch (error) {
      logger.error('Error updating institution', { error, institutionId, data });
      throw error;
    }
  }

  /**
   * Change verification status of an institution
   */
  async verifyInstitution(institutionId: string, userId: string, status: VerificationStatus, notes?: string): Promise<Institution> {
    try {
      // Check if institution exists
      const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
      
      if (!institution) {
        throw new NotFoundError(`Institution with ID ${institutionId} not found`);
      }
      
      // Verify user has admin permissions to verify institutions
      await this.verifyAdminAccess(userId);
      
      // Update the verification status
      const updatedInstitution = await prisma.institution.update({
        where: { id: institutionId },
        data: {
          verificationStatus: status as string,
          verifiedAt: status === VerificationStatus.VERIFIED ? new Date() : institution.verifiedAt,
          notes: notes ? `${institution.notes ? institution.notes + '\n' : ''}Verification note (${new Date().toISOString()}): ${notes}` : institution.notes,
          updatedAt: new Date(),
        },
      });
      
      // Log the verification
      await this.logAuditEvent({
        action: 'INSTITUTION_VERIFICATION_CHANGED',
        entityType: 'Institution',
        entityId: institutionId,
        description: `Institution "${updatedInstitution.name}" verification status changed to ${status}`,
        performedById: userId,
        institutionId: institutionId,
        metadata: { previousStatus: institution.verificationStatus, newStatus: status, notes },
      });
      
      return updatedInstitution as unknown as Institution;
    } catch (error) {
      logger.error('Error verifying institution', { error, institutionId, status });
      throw error;
    }
  }

  /**
   * Deactivate an institution
   */
  async deactivateInstitution(institutionId: string, userId: string, reason?: string): Promise<Institution> {
    try {
      // Check if institution exists
      const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
      
      if (!institution) {
        throw new NotFoundError(`Institution with ID ${institutionId} not found`);
      }
      
      // Verify user has admin permissions to deactivate institutions
      await this.verifyAdminAccess(userId);
      
      // Deactivate the institution
      const updatedInstitution = await prisma.institution.update({
        where: { id: institutionId },
        data: {
          isActive: false,
          notes: reason ? `${institution.notes ? institution.notes + '\n' : ''}Deactivation reason (${new Date().toISOString()}): ${reason}` : institution.notes,
          updatedAt: new Date(),
        },
      });
      
      // Log the deactivation
      await this.logAuditEvent({
        action: 'INSTITUTION_DEACTIVATED',
        entityType: 'Institution',
        entityId: institutionId,
        description: `Institution "${updatedInstitution.name}" deactivated`,
        performedById: userId,
        institutionId: institutionId,
        metadata: { reason },
      });
      
      return updatedInstitution as unknown as Institution;
    } catch (error) {
      logger.error('Error deactivating institution', { error, institutionId });
      throw error;
    }
  }

  /**
   * Reactivate an institution
   */
  async reactivateInstitution(institutionId: string, userId: string, notes?: string): Promise<Institution> {
    try {
      // Check if institution exists
      const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
      
      if (!institution) {
        throw new NotFoundError(`Institution with ID ${institutionId} not found`);
      }
      
      // Verify user has admin permissions to reactivate institutions
      await this.verifyAdminAccess(userId);
      
      // Reactivate the institution
      const updatedInstitution = await prisma.institution.update({
        where: { id: institutionId },
        data: {
          isActive: true,
          notes: notes ? `${institution.notes ? institution.notes + '\n' : ''}Reactivation note (${new Date().toISOString()}): ${notes}` : institution.notes,
          updatedAt: new Date(),
        },
      });
      
      // Log the reactivation
      await this.logAuditEvent({
        action: 'INSTITUTION_REACTIVATED',
        entityType: 'Institution',
        entityId: institutionId,
        description: `Institution "${updatedInstitution.name}" reactivated`,
        performedById: userId,
        institutionId: institutionId,
        metadata: { notes },
      });
      
      return updatedInstitution as unknown as Institution;
    } catch (error) {
      logger.error('Error reactivating institution', { error, institutionId });
      throw error;
    }
  }

  /**
   * Get institution statistics
   */
  async getInstitutionStatistics(userId: string): Promise<any> {
    try {
      // Verify user has admin permissions
      await this.verifyAdminAccess(userId);
      
      // Get total counts by type
      const typeStats = await prisma.institution.groupBy({
        by: ['type'],
        _count: true,
      });
      
      // Get total counts by size
      const sizeStats = await prisma.institution.groupBy({
        by: ['size'],
        _count: true,
      });
      
      // Get total counts by verification status
      const verificationStats = await prisma.institution.groupBy({
        by: ['verificationStatus'],
        _count: true,
      });
      
      // Get monthly registrations for the past year
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      
      const registrations = await prisma.$queryRaw`
        SELECT 
          DATEPART(year, "createdAt") as year,
          DATEPART(month, "createdAt") as month,
          COUNT(*) as count
        FROM "Institution"
        WHERE "createdAt" >= ${oneYearAgo}
        GROUP BY DATEPART(year, "createdAt"), DATEPART(month, "createdAt")
        ORDER BY year, month
      `;
      
      return {
        typeStats,
        sizeStats,
        verificationStats,
        registrations,
        total: await prisma.institution.count(),
        active: await prisma.institution.count({ where: { isActive: true } }),
        verified: await prisma.institution.count({ where: { verificationStatus: VerificationStatus.VERIFIED } }),
      };
    } catch (error) {
      logger.error('Error fetching institution statistics', { error });
      throw error;
    }
  }

  /**
   * Add a user as an admin of an institution
   */
  async addInstitutionAdmin(institutionId: string, userId: string, adminId: string): Promise<void> {
    try {
      // Check if institution exists
      const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
      
      if (!institution) {
        throw new NotFoundError(`Institution with ID ${institutionId} not found`);
      }
      
      // Verify the user making the request has admin permissions for this institution
      await this.verifyInstitutionAdminAccess(userId, institutionId);
      
      // Add the user as an admin
      await prisma.institution.update({
        where: { id: institutionId },
        data: {
          admins: {
            connect: { id: adminId },
          },
        },
      });
      
      // Log the action
      await this.logAuditEvent({
        action: 'INSTITUTION_ADMIN_ADDED',
        entityType: 'Institution',
        entityId: institutionId,
        description: `User added as admin for institution "${institution.name}"`,
        performedById: userId,
        institutionId: institutionId,
        metadata: { adminId },
      });
    } catch (error) {
      logger.error('Error adding institution admin', { error, institutionId, adminId });
      throw error;
    }
  }

  /**
   * Remove a user as an admin of an institution
   */
  async removeInstitutionAdmin(institutionId: string, userId: string, adminId: string): Promise<void> {
    try {
      // Check if institution exists
      const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
      
      if (!institution) {
        throw new NotFoundError(`Institution with ID ${institutionId} not found`);
      }
      
      // Verify the user making the request has admin permissions for this institution
      await this.verifyInstitutionAdminAccess(userId, institutionId);
      
      // Prevent removing the last admin
      const adminCount = await prisma.institution.findUnique({
        where: { id: institutionId },
        select: { _count: { select: { admins: true } } },
      });
      
      if (adminCount?._count.admins === 1) {
        throw new ValidationError('Cannot remove the last institution administrator');
      }
      
      // Remove the user as an admin
      await prisma.institution.update({
        where: { id: institutionId },
        data: {
          admins: {
            disconnect: { id: adminId },
          },
        },
      });
      
      // Log the action
      await this.logAuditEvent({
        action: 'INSTITUTION_ADMIN_REMOVED',
        entityType: 'Institution',
        entityId: institutionId,
        description: `User removed as admin from institution "${institution.name}"`,
        performedById: userId,
        institutionId: institutionId,
        metadata: { adminId },
      });
    } catch (error) {
      logger.error('Error removing institution admin', { error, institutionId, adminId });
      throw error;
    }
  }

  // Private methods

  /**
   * Validate institution input data
   */
  private validateInstitutionInput(data: CreateInstitutionInput | UpdateInstitutionInput): void {
    // Validate name
    if ('name' in data && (!data.name || data.name.trim().length < 2)) {
      throw new ValidationError('Institution name must be at least 2 characters');
    }
    
    // Validate email
    if ('email' in data && data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new ValidationError('Invalid email format');
      }
    }
    
    // Validate website URL if provided
    if ('website' in data && data.website) {
      try {
        new URL(data.website);
      } catch {
        throw new ValidationError('Invalid website URL format');
      }
    }
    
    // Validate logo URL if provided
    if ('logoUrl' in data && data.logoUrl) {
      try {
        new URL(data.logoUrl);
      } catch {
        throw new ValidationError('Invalid logo URL format');
      }
    }
  }

  /**
   * Log an audit event
   */
  private async logAuditEvent(data: {
    action: string;
    entityType: string;
    entityId: string;
    description: string;
    performedById: string;
    institutionId?: string;
    subscriptionId?: string;
    metadata?: any;
  }): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          id: generateId('audit'),
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          description: data.description,
          performedById: data.performedById,
          institutionId: data.institutionId,
          subscriptionId: data.subscriptionId,
          metadata: data.metadata,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      logger.error('Error logging audit event', { error, data });
      // Don't throw, just log the error
    }
  }

  /**
   * Verify that a user has access to view an institution
   */
  private async verifyInstitutionAccess(userId: string, institutionId: string): Promise<void> {
    // Check if user is a system admin
    const isAdmin = await this.isSystemAdmin(userId);
    if (isAdmin) return;
    
    // Check if user is associated with the institution
    const userInstitution = await prisma.user.findFirst({
      where: {
        id: userId,
        OR: [
          { institutionId: institutionId },
          { adminInstitutions: { some: { id: institutionId } } },
          { departments: { some: { institutionId: institutionId } } },
        ],
      },
    });
    
    if (!userInstitution) {
      throw new AccessDeniedError('You do not have permission to access this institution');
    }
  }

  /**
   * Verify that a user has access to list institutions
   */
  private async verifyInstitutionListAccess(userId: string): Promise<void> {
    // Check if user is a system admin
    const isAdmin = await this.isSystemAdmin(userId);
    if (isAdmin) return;
    
    // TODO: Add more granular permissions for institution listing
    // For now, just check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AccessDeniedError('User not found');
    }
  }

  /**
   * Verify that a user has admin access to an institution
   */
  private async verifyInstitutionAdminAccess(userId: string, institutionId: string): Promise<void> {
    // Check if user is a system admin
    const isAdmin = await this.isSystemAdmin(userId);
    if (isAdmin) return;
    
    // Check if user is an admin of the institution
    const isInstitutionAdmin = await prisma.institution.findFirst({
      where: {
        id: institutionId,
        admins: { some: { id: userId } },
      },
    });
    
    if (!isInstitutionAdmin) {
      throw new AccessDeniedError('You do not have admin permission for this institution');
    }
  }

  /**
   * Verify that a user has permission to update an institution
   */
  private async verifyInstitutionUpdateAccess(userId: string, institutionId: string): Promise<void> {
    // Same as admin access for now
    await this.verifyInstitutionAdminAccess(userId, institutionId);
  }

  /**
   * Verify that a user has system admin permissions
   */
  private async verifyAdminAccess(userId: string): Promise<void> {
    const isAdmin = await this.isSystemAdmin(userId);
    
    if (!isAdmin) {
      throw new AccessDeniedError('You do not have admin permission');
    }
  }

  /**
   * Check if a user is a system admin
   */
  private async isSystemAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true },
    });
    
    return user?.roles.includes(UserRole.ADMIN) || false;
  }
}

// Export a singleton instance
export const institutionService = new InstitutionService();