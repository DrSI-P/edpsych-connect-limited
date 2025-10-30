import { MongoClient, Db } from 'mongodb';
import { getDatabase, getMongoClient } from './mongodb-pool';

/**
 * Connect to database with connection pooling
 * @returns MongoDB database instance
 */
export async function dbConnect(): Promise<Db> {
  return getDatabase();
}

/**
 * Get MongoDB client with connection pooling
 * @returns MongoDB client instance
 */
export async function getClient(): Promise<MongoClient> {
  return getMongoClient();
}