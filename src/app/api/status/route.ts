export const dynamic = 'force-dynamic';

export async function GET() {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  
  return new Response(JSON.stringify({
    status: 'operational',
    uptime,
    memory: {
      rss: Math.round(memory.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + 'MB'
    },
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}