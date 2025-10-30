/**
 * Authentication API - User Verification Route
 * Returns current authenticated user information
 */

import { NextRequest, NextResponse } from 'next/server';
import authService from '@/lib/auth/auth-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user from request
    const user = await authService.getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get tenant information
    const tenant = await authService.getTenant(user.tenantId);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        roles: user.roles,
        permissions: user.permissions,
        profile: user.profile,
        metadata: {
          ...user.metadata,
          createdAt: user.metadata.createdAt.toISOString(),
          updatedAt: user.metadata.updatedAt.toISOString(),
          lastLoginAt: user.metadata.lastLoginAt?.toISOString()
        }
      },
      tenant
    });

  } catch (error) {
    console.error('User verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}