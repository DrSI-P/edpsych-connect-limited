/**
 * Health check API endpoint
 * This file exists to match the api/*.js pattern in vercel.json
 */

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    deployment: process.env.VERCEL_URL || 'local'
  });
}