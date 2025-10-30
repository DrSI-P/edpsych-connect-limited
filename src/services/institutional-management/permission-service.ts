import { PrismaClient } from '@prisma/client';
import { ValidationError, AccessDeniedError } from './errors';

/**
 * Service for managing permissions related to institutional management
 */
export class PermissionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Check if a user can create institutions
   */
  async canCreateInstitutions(userId: string): Promise<boolean> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    // Get the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true }
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Check if user has required role (admin or institutional manager)
    const hasRequiredRole = user.roles.some((role: string) =>
      ['ADMIN', 'INSTITUTIONAL_MANAGER'].includes(role)
    );

    return hasRequiredRole;
  }

  /**
   * Check if a user can manage an institution
   */
  async canManageInstitution(userId: string, institutionId: string): Promise<boolean> {
    if (!userId || !institutionId) {
      throw new ValidationError('User ID and Institution ID are required');
    }

    // Get the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        roles: true,
        managedInstitutions: true
      }
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Check if user is admin
    const isAdmin = user.roles.includes('ADMIN');
    if (isAdmin) {
      return true;
    }

    // Check if user is an institutional manager for this specific institution
    const isInstitutionManager = user.managedInstitutions.some(
      (institution) => institution.id === institutionId
    );

    return isInstitutionManager;
  }

  /**
   * Check if a user can view an institution
   */
  async canViewInstitution(userId: string, institutionId: string): Promise<boolean> {
    if (!userId || !institutionId) {
      throw new ValidationError('User ID and Institution ID are required');
    }

    // Get the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        roles: true,
        managedInstitutions: true,
        institution: true
      }
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Check if user is admin
    const isAdmin = user.roles.includes('ADMIN');
    if (isAdmin) {
      return true;
    }

    // Check if user is an institutional manager for this specific institution
    const isInstitutionManager = user.managedInstitutions.some(
      (institution) => institution.id === institutionId
    );
    
    if (isInstitutionManager) {
      return true;
    }

    // Check if user belongs to this institution
    const belongsToInstitution = user.institution?.id === institutionId;

    return belongsToInstitution;
  }

  /**
   * Check if a user can manage departments in an institution
   */
  async canManageInstitutionDepartments(userId: string, institutionId: string): Promise<boolean> {
    return this.canManageInstitution(userId, institutionId);
  }

  /**
   * Check if a user can view departments in an institution
   */
  async canViewInstitutionDepartments(userId: string, institutionId: string): Promise<boolean> {
    return this.canViewInstitution(userId, institutionId);
  }

  /**
   * Check if a user can manage contacts in an institution
   */
  async canManageInstitutionContacts(userId: string, institutionId: string): Promise<boolean> {
    return this.canManageInstitution(userId, institutionId);
  }

  /**
   * Check if a user can view contacts in an institution
   */
  async canViewInstitutionContacts(userId: string, institutionId: string): Promise<boolean> {
    return this.canViewInstitution(userId, institutionId);
  }

  /**
   * Check if a user can manage subscriptions for an institution
   */
  async canManageInstitutionSubscriptions(userId: string, institutionId: string): Promise<boolean> {
    if (!userId || !institutionId) {
      throw new ValidationError('User ID and Institution ID are required');
    }

    // Get the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true }
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Only admins can manage subscriptions
    const isAdmin = user.roles.includes('ADMIN');
    
    return isAdmin;
  }

  /**
   * Check if a user can view subscriptions for an institution
   */
  async canViewInstitutionSubscriptions(userId: string, institutionId: string): Promise<boolean> {
    return this.canManageInstitution(userId, institutionId);
  }
}

// Create and export instance
const prisma = new PrismaClient();
export const permissionService = new PermissionService(prisma);