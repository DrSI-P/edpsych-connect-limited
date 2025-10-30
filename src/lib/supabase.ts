// EdPsych Connect World - Supabase Client Configuration
// DEPRECATED: This file is no longer used
// Updated: Railway Postgres Integration
// Environment: PRODUCTION
// Compliance: GDPR, ISO 27001, SOC 2

/**
 * ⚠️  DEPRECATED: This Supabase client is NOT used in production
 *
 * The EdPsych Connect World platform uses Railway Postgres, not Supabase.
 * This file is kept for reference only.
 *
 * Current Database Setup:
 * - Railway Postgres (primary database)
 * - Redis (caching and session management)
 * - MongoDB (document storage)
 * - Neo4j (graph database)
 *
 * See: apps/web/src/lib/auth.ts for the current authentication implementation
 */

// This file is intentionally left empty to prevent accidental usage
// All authentication is handled through Railway Postgres in auth.ts

console.warn('⚠️  WARNING: supabase.ts is deprecated. Use Railway Postgres instead.');