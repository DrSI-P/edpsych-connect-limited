import Stripe from 'stripe';

if (!process.env.NEXT_PUBLIC_STRIPE_API_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_API_KEY is not defined');
}

// Define types matching the Prisma schema
export enum SubscriptionTier {
  ESSENTIAL = 'ESSENTIAL',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  RESEARCHER = 'RESEARCHER',
  PSYCHOLOGIST = 'PSYCHOLOGIST',
  CUSTOM = 'CUSTOM'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  TERMLY = 'TERMLY',
  ANNUALLY = 'ANNUALLY'
}

export enum UserType {
  SCHOOL_USER = 'SCHOOL_USER',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  PSYCHOLOGIST_USER = 'PSYCHOLOGIST_USER',
  RESEARCHER_USER = 'RESEARCHER_USER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'
}

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY, {
  apiVersion: '2024-06-20', // Stripe v16.0.0 requires this API version
});

// Export the Stripe constructor for type checking
export { Stripe };