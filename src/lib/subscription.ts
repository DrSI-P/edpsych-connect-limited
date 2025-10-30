import { SubscriptionTier, SubscriptionStatus, UserType, SubscriptionInfo } from '../types';

// Feature configuration based on subscription tier
export interface FeatureConfig {
  key: string;
  name: string;
  description: string;
  tiers: SubscriptionTier[];
  userTypes?: UserType[];
}

// List of features and their availability by tier
export const FEATURES: FeatureConfig[] = [
  {
    key: 'basic_analytics',
    name: 'Basic Analytics',
    description: 'View basic usage analytics and reports',
    tiers: [
      SubscriptionTier.ESSENTIAL,
      SubscriptionTier.PROFESSIONAL,
      SubscriptionTier.ENTERPRISE,
      SubscriptionTier.RESEARCHER,
      SubscriptionTier.PSYCHOLOGIST,
    ],
  },
  {
    key: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Access to advanced analytics, trends, and insights',
    tiers: [
      SubscriptionTier.PROFESSIONAL,
      SubscriptionTier.ENTERPRISE,
      SubscriptionTier.RESEARCHER,
      SubscriptionTier.PSYCHOLOGIST,
    ],
  },
  {
    key: 'ai_assessment',
    name: 'AI Assessment',
    description: 'AI-powered student assessment and recommendations',
    tiers: [
      SubscriptionTier.ESSENTIAL,
      SubscriptionTier.PROFESSIONAL,
      SubscriptionTier.ENTERPRISE,
    ],
    userTypes: [UserType.SCHOOL_USER],
  },
  {
    key: 'advanced_ai_assessment',
    name: 'Advanced AI Assessment',
    description: 'Premium AI-powered assessment with detailed insights',
    tiers: [SubscriptionTier.PROFESSIONAL, SubscriptionTier.ENTERPRISE],
    userTypes: [UserType.SCHOOL_USER],
  },
  {
    key: 'cross_school_analytics',
    name: 'Cross-School Analytics',
    description: 'Analytics across multiple schools for educational psychologists',
    tiers: [SubscriptionTier.PSYCHOLOGIST],
    userTypes: [UserType.INDIVIDUAL_USER],
  },
  {
    key: 'anonymized_research_data',
    name: 'Anonymized Research Data',
    description: 'Access to anonymized data for research purposes',
    tiers: [SubscriptionTier.RESEARCHER],
    userTypes: [UserType.INDIVIDUAL_USER],
  },
  {
    key: 'unlimited_users',
    name: 'Unlimited Users',
    description: 'Support for unlimited users within the school',
    tiers: [SubscriptionTier.ENTERPRISE],
    userTypes: [UserType.SCHOOL_USER],
  },
  {
    key: 'priority_support',
    name: 'Priority Support',
    description: 'Priority customer support',
    tiers: [
      SubscriptionTier.PROFESSIONAL,
      SubscriptionTier.ENTERPRISE,
      SubscriptionTier.RESEARCHER,
      SubscriptionTier.PSYCHOLOGIST,
    ],
  },
  {
    key: 'custom_reporting',
    name: 'Custom Reporting',
    description: 'Create and save custom reports',
    tiers: [SubscriptionTier.ENTERPRISE, SubscriptionTier.PSYCHOLOGIST, SubscriptionTier.RESEARCHER],
  },
];

/**
 * Check if a user has access to a specific feature based on their subscription
 * @param featureKey The feature key to check
 * @param subscription The user's subscription info
 * @param userType The user's type
 * @returns Boolean indicating if the user has access to the feature
 */
export const hasFeatureAccess = (
  featureKey: string,
  subscription: SubscriptionInfo | null | undefined,
  userType: UserType = UserType.SCHOOL_USER
): boolean => {
  // No subscription means no access
  if (!subscription) {
    return false;
  }

  // Inactive subscription means no access
  if (subscription.status !== SubscriptionStatus.ACTIVE) {
    return false;
  }

  // Find the feature configuration
  const feature = FEATURES.find((f) => f.key === featureKey);
  if (!feature) {
    return false;
  }

  // Check if the user's tier has access to this feature
  const hasTierAccess = feature.tiers.includes(subscription.tier);
  if (!hasTierAccess) {
    return false;
  }

  // If the feature has user type restrictions, check if the user's type is allowed
  if (feature.userTypes && !feature.userTypes.includes(userType)) {
    return false;
  }

  return true;
};

/**
 * Get all features available to a user based on their subscription
 * @param subscription The user's subscription info
 * @param userType The user's type
 * @returns Array of features available to the user
 */
export const getAvailableFeatures = (
  subscription: SubscriptionInfo | null | undefined,
  userType: UserType = UserType.SCHOOL_USER
): FeatureConfig[] => {
  if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
    return [];
  }

  return FEATURES.filter((feature) => {
    const hasTierAccess = feature.tiers.includes(subscription.tier);
    const hasUserTypeAccess = !feature.userTypes || feature.userTypes.includes(userType);
    return hasTierAccess && hasUserTypeAccess;
  });
};

/**
 * Check if a subscription is active
 * @param subscription The subscription to check
 * @returns Boolean indicating if the subscription is active
 */
export const isSubscriptionActive = (
  subscription: SubscriptionInfo | null | undefined
): boolean => {
  return !!subscription && subscription.status === SubscriptionStatus.ACTIVE;
};

/**
 * Get human-readable subscription tier name
 * @param tier The subscription tier
 * @returns Human-readable tier name
 */
export const getSubscriptionTierName = (tier: SubscriptionTier): string => {
  const names: Record<SubscriptionTier, string> = {
    [SubscriptionTier.FREE]: 'Free',
    [SubscriptionTier.BASIC]: 'Basic',
    [SubscriptionTier.ESSENTIAL]: 'Essential',
    [SubscriptionTier.PROFESSIONAL]: 'Professional',
    [SubscriptionTier.ENTERPRISE]: 'Enterprise',
    [SubscriptionTier.RESEARCHER]: 'Researcher',
    [SubscriptionTier.PSYCHOLOGIST]: 'Educational Psychologist',
    [SubscriptionTier.CUSTOM]: 'Custom',
  };
  return names[tier] || tier;
};

/**
 * Get human-readable billing cycle name
 * @param cycle The billing cycle
 * @returns Human-readable cycle name
 */
export const getBillingCycleName = (cycle: string): string => {
  const names: Record<string, string> = {
    MONTHLY: 'Monthly',
    TERMLY: 'Termly (3 times per year)',
    ANNUALLY: 'Annually',
  };
  return names[cycle] || cycle;
};

/**
 * Fetch the active subscription for a user from the database
 * Note: In Phase 1, this returns mock data. Will be replaced with real DB queries in Phase 2.
 * @param id The user ID
 * @returns The user's active subscription, or null if none exists
 */
export const getUserSubscription = async (id: string) => {
  // In Phase 1, return mock subscription data since User model doesn't exist in schema
  // const user = await prisma.user.findUnique({
  //   where: { id: id },
  // });

  // if (!user) {
  //   return null;
  // }

  // For Phase 1, return a mock subscription
  return {
    id: 'mock-subscription-' + id,
    userId: id, // Changed from id: id to avoid duplicate property
    tier: SubscriptionTier.PROFESSIONAL,
    status: SubscriptionStatus.ACTIVE,
    billingCycle: 'MONTHLY',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    quantity: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};