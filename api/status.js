/**
 * Status API endpoint
 * This file exists to match the api/*.js pattern in vercel.json
 */

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}