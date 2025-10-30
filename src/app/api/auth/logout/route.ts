/**
 * Authentication API - Logout Route
 * Handles user logout and token cleanup
 */

import { NextRequest, NextResponse } from 'next/server';
import authService from '@/lib/auth/auth-service';

export async function POST(request: NextRequest) {
  try {
    // Create logout response (clears cookies)
    return authService.createLogoutResponse();

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}