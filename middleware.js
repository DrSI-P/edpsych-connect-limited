// Simplified middleware for Vercel deployment
// This middleware configuration is optimized for visibility on Vercel
// without any preloaded context or complex configuration

import { NextResponse } from 'next/server';

export function middleware(request) {
  // Allow all requests to pass through
  // This ensures visibility of the application without authentication barriers
  
  // Add basic security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

// Configure middleware to run on all routes
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api/).*)'
  ],
};