/**
 * Authentication API - Token Refresh Route
 * Handles token refresh requests
 */

import { NextRequest, NextResponse } from 'next/server';
import authService from '@/lib/auth/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // For now, we'll create a simple refresh mechanism
    // In production, implement proper refresh token validation
    const user = await authService.verifyToken(refreshToken);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = authService['generateTokens'](user);

    // Create authenticated response
    return authService.createAuthResponse(user, tokens, {
      data: {
        message: 'Token refreshed successfully'
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}