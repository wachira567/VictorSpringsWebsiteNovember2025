import { Pool, PoolClient } from "pg";

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error(
    "Please add DATABASE_URL to .env.local or Netlify environment variables"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).pool;

if (!cached) {
  cached = (global as any).pool = { pool: null };
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Increase timeout to 10 seconds
});

async function connectToDatabase(): Promise<PoolClient> {
  return await pool.connect();
}

export { connectToDatabase };
