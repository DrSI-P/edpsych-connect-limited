// ============================================================================
// REACT HOOK: useSubscription
// File: hooks/useSubscription.ts
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Feature, SubscriptionTier } from '@prisma/client';

interface SubscriptionData {
  id: number;
  tier: SubscriptionTier;
  planType: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date | null;
  paymentStatus: string;
  limits: {
    maxSchools?: number;
    maxUsers?: number;
    maxStudents?: number;
  };
}

interface CapacityStatus {
  withinLimits: boolean;
  limits?: {
    maxSchools?: number;
    maxUsers?: number;
    maxStudents?: number;
  };
  current?: {
    schools: number;
    users: number;
    students: number;
  };
}

/**
 * Hook to get current user's tenant subscription details
 * 
 * Usage:
 * const { subscription, availableFeatures, capacityStatus, isLoading } = useSubscription();
 * 
 * if (isLoading) return <Loading />;
 * if (!subscription) return <NoSubscription />;
 * 
 * console.log(`Current tier: ${subscription.tier}`);
 * console.log(`Features: ${availableFeatures.length}`);
 */
export function useSubscription() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
  const [capacityStatus, setCapacityStatus] = useState<CapacityStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSubscription() {
      // Wait for session to load
      if (status === 'loading') {
        return;
      }

      // Not authenticated
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const response = await fetch('/api/subscription/status');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription');
        }

        const data = await response.json();
        
        setHasSubscription(data.hasSubscription);
        setSubscription(data.subscription || null);
        setAvailableFeatures(data.availableFeatures || []);
        setCapacityStatus(data.capacityStatus || null);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setHasSubscription(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, [session, status]);

  return { 
    subscription, 
    availableFeatures, 
    capacityStatus,
    hasSubscription,
    isLoading 
  };
}