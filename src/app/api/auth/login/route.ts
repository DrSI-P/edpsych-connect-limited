/**
 * Authentication API - Login Route
 * Handles user authentication and token generation
 */

import { NextRequest, NextResponse } from 'next/server';
import authService from '@/lib/auth/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, tenantId } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const authResult = await authService.authenticateUser(email, password, tenantId);

    if (!authResult) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { user, tokens } = authResult;

    // Create authenticated response
    return authService.createAuthResponse(user, tokens, {
      data: {
        message: 'Login successful',
        tenant: await authService.getTenant(user.tenantId)
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}