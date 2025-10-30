// EdPsych Connect World - Vercel-Only Middleware
// This version removes ALL authentication checks to ensure visibility

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ⚠️ TEMPORARY SIMPLIFIED MIDDLEWARE - PHASE 1 ⚠️
 * 
 * This middleware has ALL authentication removed to get the app running.
 * Once stable, we'll add back authentication in phases.
 * 
 * Current behavior: Allow ALL requests through with no checks
 */

export async function middleware(request: NextRequest) {
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
ECHO is off.
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
ECHO is off.
    return response;
  }
ECHO is off.
  // Simply pass all requests through
  return NextResponse.next();
}

// Match everything except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Images
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
