export default function handler(req, res) {
  res.status(200).json({
    version: process.env.VERSION || '1.0.0',
    buildDate: process.env.BUILD_DATE || new Date().toISOString(),
    commit: process.env.COMMIT_SHA || 'unknown'
  });
}