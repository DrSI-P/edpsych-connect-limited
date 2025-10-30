import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { NotFoundError, ValidationError, AccessDeniedError } from './errors';
import { generateId } from '../../utils/id-generator';
import { 
  InstitutionSubscription,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRole
} from './types';

// Mock implementation for volume discount tiers until the real database is connected
const VOLUME_DISCOUNT_TIERS = [
  { minLicenses: 1, maxLicenses: 9, discountPercentage: 0 },
  { minLicenses: 10, maxLicenses: 49, discountPercentage: 10 },
  { minLicenses: 50, maxLicenses: 99, discountPercentage: 15 },
  { minLicenses: 100, maxLicenses: 499, discountPercentage: 20 },
  { minLicenses: 500, maxLicenses: 999, discountPercentage: 25 },
  { minLicenses: 1000, maxLicenses: null, discountPercentage: 30 }
];

// Mock implementation for base prices until the real database is connected
const BASE_PRICES = {
  [SubscriptionPlan.BASIC]: 9.99,
  [SubscriptionPlan.STANDARD]: 19.99,
  [SubscriptionPlan.PROFESSIONAL]: 39.99,
  [SubscriptionPlan.ENTERPRISE]: 79.99,
  [SubscriptionPlan.CUSTOM]: 0 // Custom pricing is negotiated
};

export interface CreateSubscriptionInput {
  id: string;
  plan: SubscriptionPlan;
  licenseCount: number;
  startDate: Date;
  endDate: Date;
  renewalDate?: Date;
  paymentMethod?: string;
  notes?: string;
  customDiscount?: number; // Optional override for calculated discount
  customPricePerLicense?: number; // Optional override for base price
}

export interface UpdateSubscriptionInput {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  licenseCount?: number;
  endDate?: Date;
  renewalDate?: Date;
  paymentMethod?: string;
  notes?: string;
  customDiscount?: number;
  customPricePerLicense?: number;
  cancelReason?: string;
}

export interface SubscriptionQueryOptions {
  id?: string;
  status?: SubscriptionStatus[];
  plan?: SubscriptionPlan[];
  isActive?: boolean;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  minLicenseCount?: number;
  maxLicenseCount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Service for managing institution subscriptions
 */
export class SubscriptionService {
  /**
   * Create a new subscription
   */
  async createSubscription(data: CreateSubscriptionInput, userId: string): Promise<InstitutionSubscription> {
    try {
      // Validate input
      this.validateSubscriptionInput(data);
      
      // Check if institution exists
      const institution = await this.mockCheckInstitution(data.id);
      
      if (!institution) {
        throw new NotFoundError(`Institution with ID ${data.id} not found`);
      }
      
      // Verify user has permission to create subscriptions for this institution
      await this.verifyInstitutionAdminAccess(data.id, userId);
      
      // Calculate pricing
      const { pricePerLicense, totalPrice, discountApplied } = this.calculatePricing(
        data.plan,
        data.licenseCount,
        data.customDiscount,
        data.customPricePerLicense
      );
      
      // Generate a unique ID for the subscription
      const subscriptionId = generateId('sub');
      
      // Create the subscription
      const subscription = {
        id: subscriptionId,
        institutionId: data.id,
        plan: data.plan,
        status: SubscriptionStatus.ACTIVE,
        startDate: data.startDate,
        endDate: data.endDate,
        renewalDate: data.renewalDate || data.endDate,
        licenseCount: data.licenseCount,
        licenseUsed: 0,
        pricePerLicense,
        totalPrice,
        discountApplied,
        paymentMethod: data.paymentMethod || 'Invoice',
        notes: data.notes || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // In a real implementation, this would be:
      // const subscription = await prisma.institutionSubscription.create({ data: {...} });
      
      // Log the creation
      await this.mockLogAuditEvent({
        action: 'SUBSCRIPTION_CREATED',
        entityType: 'InstitutionSubscription',
        entityId: subscription.id,
        description: `Subscription created for institution ${data.id}`,
        performedById: userId,
        institutionId: data.id,
        subscriptionId: subscription.id,
        metadata: { 
          plan: data.plan, 
          licenseCount: data.licenseCount,
          totalPrice
        },
      });
      
      return subscription as InstitutionSubscription;
    } catch (error) {
      logger.error('Error creating subscription', { error, data });
      throw error;
    }
  }

  /**
   * Get a subscription by ID
   */
  async getSubscriptionById(userId: string, subscriptionId: string): Promise<InstitutionSubscription> {
    try {
      // In a real implementation, this would be:
      // const subscription = await prisma.institutionSubscription.findUnique({
      //   where: { id: subscriptionId },
      //   include: {
      //     institution: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //   },
      // });
      
      // Mock implementation for development
      const subscription = await this.mockGetSubscription(subscriptionId);
      
      if (!subscription) {
        throw new NotFoundError(`Subscription with ID ${subscriptionId} not found`);
      }
      
      // Verify user has access to view this subscription
      await this.verifySubscriptionAccess(subscription.institutionId, userId);
      
      return subscription as InstitutionSubscription;
    } catch (error) {
      logger.error('Error fetching subscription', { error, subscriptionId });
      throw error;
    }
  }

  /**
   * Get subscriptions with filtering, sorting, and pagination
   */
  async getSubscriptions(options: SubscriptionQueryOptions, userId: string): Promise<{ data: InstitutionSubscription[]; total: number; page: number; limit: number }> {
    try {
      // Default values
      const page = options.page || 1;
      const limit = options.limit || 20;
      
      // In a real implementation, this would query the database with filters
      
      // If institutionId is provided, verify access
      if (options.id) {
        await this.verifySubscriptionAccess(options.id, userId);
      } else {
        // For listing all subscriptions, verify admin access
        await this.verifyAdminAccess(userId);
      }
      
      // Mock implementation for development
      const { subscriptions, total } = await this.mockListSubscriptions(options, page, limit);
      
      return {
        data: subscriptions as InstitutionSubscription[],
        total,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Error fetching subscriptions', { error, options });
      throw error;
    }
  }

  /**
   * Update a subscription
   */
  async updateSubscription(userId: string, data: UpdateSubscriptionInput, subscriptionId: string): Promise<InstitutionSubscription> {
    try {
      // Get the subscription
      const subscription = await this.mockGetSubscription(subscriptionId);
      
      if (!subscription) {
        throw new NotFoundError(`Subscription with ID ${subscriptionId} not found`);
      }
      
      // Verify user has permission to update this subscription
      await this.verifySubscriptionUpdateAccess(subscription.institutionId, userId);
      
      // Calculate new pricing if license count or plan changed
      let pricePerLicense = subscription.pricePerLicense;
      let totalPrice = subscription.totalPrice;
      let discountApplied = subscription.discountApplied;
      
      if (data.licenseCount || data.plan) {
        const plan = data.plan || subscription.plan;
        const licenseCount = data.licenseCount || subscription.licenseCount;
        
        const pricing = this.calculatePricing(
          plan,
          licenseCount,
          data.customDiscount !== undefined ? data.customDiscount : subscription.discountApplied,
          data.customPricePerLicense !== undefined ? data.customPricePerLicense : subscription.pricePerLicense
        );
        
        pricePerLicense = pricing.pricePerLicense;
        totalPrice = pricing.totalPrice;
        discountApplied = pricing.discountApplied;
      }
      
      // Handle subscription cancellation
      if (data.status === SubscriptionStatus.CANCELLED && subscription.status !== SubscriptionStatus.CANCELLED) {
        if (!data.cancelReason) {
          throw new ValidationError('Cancel reason is required when cancelling a subscription');
        }
      }
      
      // Update the subscription
      const updatedSubscription = {
        ...subscription,
        ...data,
        pricePerLicense,
        totalPrice,
        discountApplied,
        updatedAt: new Date(),
      };
      
      // In a real implementation, this would be:
      // const updatedSubscription = await prisma.institutionSubscription.update({
      //   where: { id },
      //   data: { ... },
      // });
      
      // Log the update
      await this.mockLogAuditEvent({
        action: 'SUBSCRIPTION_UPDATED',
        entityType: 'InstitutionSubscription',
        entityId: subscriptionId,
        description: `Subscription updated for institution ${subscription.institutionId}`,
        performedById: userId,
        institutionId: subscription.institutionId,
        subscriptionId: subscriptionId,
        metadata: { 
          updatedFields: Object.keys(data),
          newPlan: data.plan,
          newLicenseCount: data.licenseCount,
          newStatus: data.status,
          newTotalPrice: totalPrice
        },
      });
      
      return updatedSubscription as InstitutionSubscription;
    } catch (error) {
      logger.error('Error updating subscription', { error, subscriptionId, data });
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(userId: string, reason: string, subscriptionId: string): Promise<InstitutionSubscription> {
    try {
      // Get the subscription
      const subscription = await this.mockGetSubscription(subscriptionId);
      
      if (!subscription) {
        throw new NotFoundError(`Subscription with ID ${subscriptionId} not found`);
      }
      
      // Verify user has permission to cancel this subscription
      await this.verifySubscriptionUpdateAccess(subscription.institutionId, userId);
      
      // Cannot cancel an already cancelled subscription
      if (subscription.status === SubscriptionStatus.CANCELLED) {
        throw new ValidationError('Subscription is already cancelled');
      }
      
      // Update the subscription
      const updatedSubscription = {
        ...subscription,
        status: SubscriptionStatus.CANCELLED,
        cancelReason: reason,
        updatedAt: new Date(),
      };
      
      // In a real implementation, this would be:
      // const updatedSubscription = await prisma.institutionSubscription.update({
      //   where: { id },
      //   data: {
      //     status: SubscriptionStatus.CANCELLED,
      //     cancelReason: reason,
      //     updatedAt: new Date(),
      //   },
      // });
      
      // Log the cancellation
      await this.mockLogAuditEvent({
        action: 'SUBSCRIPTION_CANCELLED',
        entityType: 'InstitutionSubscription',
        entityId: subscriptionId,
        description: `Subscription cancelled for institution ${subscription.institutionId}`,
        performedById: userId,
        institutionId: subscription.institutionId,
        subscriptionId: subscriptionId,
        metadata: { reason },
      });
      
      return updatedSubscription as InstitutionSubscription;
    } catch (error) {
      logger.error('Error cancelling subscription', { error, subscriptionId });
      throw error;
    }
  }

  /**
   * Reactivate a cancelled subscription
   */
  async reactivateSubscription(userId: string, subscriptionId: string, notes?: string): Promise<InstitutionSubscription> {
    try {
      // Get the subscription
      const subscription = await this.mockGetSubscription(subscriptionId);
      
      if (!subscription) {
        throw new NotFoundError(`Subscription with ID ${subscriptionId} not found`);
      }
      
      // Verify user has permission to reactivate this subscription
      await this.verifySubscriptionUpdateAccess(subscription.institutionId, userId);
      
      // Cannot reactivate an active subscription
      if (subscription.status === SubscriptionStatus.ACTIVE) {
        throw new ValidationError('Subscription is already active');
      }
      
      // Update the subscription
      const updatedSubscription = {
        ...subscription,
        status: SubscriptionStatus.ACTIVE,
        cancelReason: null,
        notes: notes ? `${subscription.notes ? subscription.notes + '\n' : ''}Reactivation note (${new Date().toISOString()}): ${notes}` : subscription.notes,
        updatedAt: new Date(),
      };
      
      // In a real implementation, this would be:
      // const updatedSubscription = await prisma.institutionSubscription.update({
      //   where: { id },
      //   data: {
      //     status: SubscriptionStatus.ACTIVE,
      //     cancelReason: null,
      //     notes: notes ? `${subscription.notes ? subscription.notes + '\n' : ''}Reactivation note (${new Date().toISOString()}): ${notes}` : subscription.notes,
      //     updatedAt: new Date(),
      //   },
      // });
      
      // Log the reactivation
      await this.mockLogAuditEvent({
        action: 'SUBSCRIPTION_REACTIVATED',
        entityType: 'InstitutionSubscription',
        entityId: subscriptionId,
        description: `Subscription reactivated for institution ${subscription.institutionId}`,
        performedById: userId,
        institutionId: subscription.institutionId,
        subscriptionId: subscriptionId,
        metadata: { notes },
      });
      
      return updatedSubscription as InstitutionSubscription;
    } catch (error) {
      logger.error('Error reactivating subscription', { error, subscriptionId });
      throw error;
    }
  }

  /**
   * Adjust license count for a subscription
   */
  async adjustLicenseCount(userId: string, newLicenseCount: number, subscriptionId: string, notes?: string): Promise<InstitutionSubscription> {
    try {
      // Get the subscription
      const subscription = await this.mockGetSubscription(subscriptionId);
      
      if (!subscription) {
        throw new NotFoundError(`Subscription with ID ${subscriptionId} not found`);
      }
      
      // Verify user has permission to update this subscription
      await this.verifySubscriptionUpdateAccess(subscription.institutionId, userId);
      
      // Validate the new license count
      if (newLicenseCount < subscription.licenseUsed) {
        throw new ValidationError(`Cannot reduce license count below the number of licenses currently in use (${subscription.licenseUsed})`);
      }
      
      if (newLicenseCount < 1) {
        throw new ValidationError('License count must be at least 1');
      }
      
      // Calculate new pricing
      const { pricePerLicense, totalPrice, discountApplied } = this.calculatePricing(
        subscription.plan,
        newLicenseCount,
        subscription.discountApplied,
        subscription.pricePerLicense
      );
      
      // Update the subscription
      const updatedSubscription = {
        ...subscription,
        licenseCount: newLicenseCount,
        pricePerLicense,
        totalPrice,
        discountApplied,
        notes: notes ? `${subscription.notes ? subscription.notes + '\n' : ''}License adjustment (${new Date().toISOString()}): ${notes}` : subscription.notes,
        updatedAt: new Date(),
      };
      
      // In a real implementation, this would be:
      // const updatedSubscription = await prisma.institutionSubscription.update({
      //   where: { id },
      //   data: {
      //     licenseCount: newLicenseCount,
      //     pricePerLicense,
      //     totalPrice,
      //     discountApplied,
      //     notes: notes ? `${subscription.notes ? subscription.notes + '\n' : ''}License adjustment (${new Date().toISOString()}): ${notes}` : subscription.notes,
      //     updatedAt: new Date(),
      //   },
      // });
      
      // Log the license adjustment
      await this.mockLogAuditEvent({
        action: 'SUBSCRIPTION_LICENSE_ADJUSTED',
        entityType: 'InstitutionSubscription',
        entityId: subscriptionId,
        description: `Subscription license count adjusted for institution ${subscription.institutionId}`,
        performedById: userId,
        institutionId: subscription.institutionId,
        subscriptionId: subscriptionId,
        metadata: { 
          previousLicenseCount: subscription.licenseCount,
          newLicenseCount,
          previousTotalPrice: subscription.totalPrice,
          newTotalPrice: totalPrice,
          notes
        },
      });
      
      return updatedSubscription as InstitutionSubscription;
    } catch (error) {
      logger.error('Error adjusting license count', { error, subscriptionId, newLicenseCount });
      throw error;
    }
  }

  /**
   * Get available volume discount tiers
   */
  async getVolumeDiscountTiers(userId: string): Promise<any[]> {
    try {
      // In a real implementation, this would fetch from the database
      // const tiers = await prisma.volumeDiscountTier.findMany({
      //   orderBy: { minLicenses: 'asc' },
      // });
      
      // For now, return the mock tiers
      return VOLUME_DISCOUNT_TIERS;
    } catch (error) {
      logger.error('Error fetching volume discount tiers', { error });
      throw error;
    }
  }

  /**
   * Get pricing for a plan and license count
   */
  calculatePricing(
    plan: SubscriptionPlan,
    licenseCount: number,
    customDiscount?: number,
    customPricePerLicense?: number
  ): { pricePerLicense: number, totalPrice: number, discountApplied: number } {
    // Get base price for the plan
    const basePrice = customPricePerLicense !== undefined ? customPricePerLicense : BASE_PRICES[plan];
    
    // Determine discount percentage based on license count
    let discountPercentage = 0;
    
    // If custom discount is provided, use it
    if (customDiscount !== undefined) {
      discountPercentage = customDiscount;
    } else {
      // Find applicable discount tier
      for (const tier of VOLUME_DISCOUNT_TIERS) {
        if (
          licenseCount >= tier.minLicenses && 
          (tier.maxLicenses === null || licenseCount <= tier.maxLicenses)
        ) {
          discountPercentage = tier.discountPercentage;
          break;
        }
      }
    }
    
    // Calculate price per license after discount
    const pricePerLicense = basePrice * (1 - (discountPercentage / 100));
    
    // Calculate total price
    const totalPrice = pricePerLicense * licenseCount;
    
    return {
      pricePerLicense,
      totalPrice,
      discountApplied: discountPercentage,
    };
  }

  // Private methods

  /**
   * Validate subscription input data
   */
  private validateSubscriptionInput(data: CreateSubscriptionInput | UpdateSubscriptionInput): void {
    // Validate license count
    if ('licenseCount' in data && data.licenseCount !== undefined) {
      if (data.licenseCount < 1) {
        throw new ValidationError('License count must be at least 1');
      }
    }
    
    // Validate dates
    if ('startDate' in data && data.startDate && 'endDate' in data && data.endDate) {
      if (data.startDate >= data.endDate) {
        throw new ValidationError('Start date must be before end date');
      }
    }
    
    // Validate discount
    if ('customDiscount' in data && data.customDiscount !== undefined) {
      if (data.customDiscount < 0 || data.customDiscount > 100) {
        throw new ValidationError('Custom discount must be between 0 and 100');
      }
    }
    
    // Validate price
    if ('customPricePerLicense' in data && data.customPricePerLicense !== undefined) {
      if (data.customPricePerLicense < 0) {
        throw new ValidationError('Custom price per license cannot be negative');
      }
    }
  }

  // Mock methods for development - these would be replaced by actual database calls

  /**
   * Mock check if an institution exists
   */
  private async mockCheckInstitution(id: string): Promise<any> {
    // Simulate database lookup
    return { id: id, name: 'Test Institution' };
  }

  /**
   * Mock get subscription by ID
   */
  private async mockGetSubscription(subscriptionId: string): Promise<any> {
    // Simulate database lookup
    return {
      id: subscriptionId,
      institutionId: 'inst_12345',
      plan: SubscriptionPlan.PROFESSIONAL,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      renewalDate: new Date('2025-12-31'),
      licenseCount: 50,
      licenseUsed: 30,
      pricePerLicense: 33.99,
      totalPrice: 1699.50,
      discountApplied: 15,
      paymentMethod: 'Invoice',
      notes: '',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15'),
    };
  }

  /**
   * Mock list subscriptions
   */
  private async mockListSubscriptions(options: SubscriptionQueryOptions, page: number, limit: number): Promise<{ subscriptions: any[], total: number }> {
    // Simulate database lookup
    const subscriptions = [
      {
        id: 'sub_12345',
        institutionId: 'inst_12345',
        plan: SubscriptionPlan.PROFESSIONAL,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        renewalDate: new Date('2025-12-31'),
        licenseCount: 50,
        licenseUsed: 30,
        pricePerLicense: 33.99,
        totalPrice: 1699.50,
        discountApplied: 15,
        paymentMethod: 'Invoice',
        notes: '',
        createdAt: new Date('2024-12-15'),
        updatedAt: new Date('2024-12-15'),
      }
    ];
    
    return {
      subscriptions,
      total: 1,
    };
  }

  /**
   * Mock log audit event
   */
  private async mockLogAuditEvent(data: any): Promise<void> {
    // In a real implementation, this would insert into the database
    logger.info('Audit event logged', data);
  }

  /**
   * Verify that a user has access to view subscription information for an institution
   */
  private async verifySubscriptionAccess(institutionId: string, userId: string): Promise<void> {
    // Check if user is a system admin
    const isAdmin = await this.isSystemAdmin(userId);
    if (isAdmin) return;
    
    // Check if user is associated with the institution
    const userInstitution = await this.mockCheckUserInstitution(userId, institutionId);
    
    if (!userInstitution) {
      throw new AccessDeniedError('You do not have permission to access subscriptions for this institution');
    }
  }

  /**
   * Verify that a user has admin access to an institution's subscriptions
   */
  private async verifySubscriptionUpdateAccess(institutionId: string, userId: string): Promise<void> {
    // Check if user is a system admin
    const isAdmin = await this.isSystemAdmin(userId);
    if (isAdmin) return;
    
    // Check if user is an admin of the institution
    const isInstitutionAdmin = await this.mockCheckInstitutionAdmin(userId, institutionId);
    
    if (!isInstitutionAdmin) {
      throw new AccessDeniedError('You do not have admin permission for this institution\'s subscriptions');
    }
  }

  /**
   * Verify that a user has admin access to an institution
   */
  private async verifyInstitutionAdminAccess(institutionId: string, userId: string): Promise<void>

 {
    // Same as subscription update access
    await this.verifySubscriptionUpdateAccess(institutionId, userId);
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
    // Mock implementation
    // In a real implementation, this would check the user's role in the database
    return userId === 'admin_user_id';
  }

  /**
   * Mock check if user is associated with an institution
   */
  private async mockCheckUserInstitution(userId: string, institutionId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  /**
   * Mock check if user is an admin of an institution
   */
  private async mockCheckInstitutionAdmin(userId: string, institutionId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }
}

// Export a singleton instance
export const subscriptionService = new SubscriptionService();