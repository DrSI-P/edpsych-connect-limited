export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(JSON.stringify({
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nextjs: process.env.NEXT_RUNTIME || 'unknown',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}