import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection
const connectionString = process.env.DATABASE_URL!;

// Create the database instance
export const db = drizzle(postgres(connectionString), { schema });

// Export schema for migrations
export * from './schema'; 