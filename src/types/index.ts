// Export all types
export * from './Challenge';

// Add additional type exports for subscription tiers
export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  ESSENTIAL = 'ESSENTIAL',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  RESEARCHER = 'RESEARCHER',
  PSYCHOLOGIST = 'PSYCHOLOGIST',
  CUSTOM = 'CUSTOM'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
  TERMLY = 'TERMLY'
}

export enum UserType {
  SCHOOL_USER = 'SCHOOL_USER',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  INDIVIDUAL_USER = 'INDIVIDUAL_USER',
  PSYCHOLOGIST_USER = 'PSYCHOLOGIST_USER',
  RESEARCHER_USER = 'RESEARCHER_USER'
}

// Add user role enum
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  TRIALING = 'TRIALING',
  TRIAL_EXPIRED = 'TRIAL_EXPIRED',
  TRIAL = 'TRIAL'
}

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  userType: UserType;
  billingCycle?: BillingCycle;
  currentPeriodEnd?: string;
  quantity?: number;
  amount?: number;
  startDate?: string;
  endDate?: string;
  renewalDate?: string;
}