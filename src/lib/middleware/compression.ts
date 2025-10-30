import { NextRequest, NextResponse } from 'next/server';

/**
 * Apply compression to the response if supported
 * This is a simplified version compatible with Edge Runtime
 */
export async function applyCompression(
  _request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  // In Edge Runtime, we can't use compression libraries
  // We rely on Vercel's automatic compression
  return response;
}
