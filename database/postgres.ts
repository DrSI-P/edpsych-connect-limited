/**
 * PostgreSQL Database Client
 * This is a mock implementation for build purposes
 */

export interface PostgresClient {
  query: (text: string, params?: any[]) => Promise<{ rows: any[], rowCount: number }>;
}

export function getPostgresClient(): PostgresClient {
  // This is a mock implementation for the build process
  return {
    query: async (text: string, params?: any[]) => {
      console.log('Mock PostgreSQL query:', text, params);
      return {
        rows: [],
        rowCount: 0
      };
    }
  };
}

export const userDb = {
  getUserById: async (id: string) => {
    console.log('Mock getUserById:', id);
    return null;
  },
  getUserByEmail: async (email: string) => {
    console.log('Mock getUserByEmail:', email);
    return null;
  },
  createUser: async (userData: any) => {
    console.log('Mock createUser:', userData);
    return { id: 'mock-id', ...userData };
  }
};