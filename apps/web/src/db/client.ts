import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  // In serverless environments (e.g. Vercel, AWS Lambda), the filesystem is read-only except /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    return 'file:/tmp/vedica.db';
  }
  return 'file:vedica.db';
}

const client = createClient({
  url: getDatabaseUrl(),
});

export const db = drizzle(client, { schema });

client.execute(`
  CREATE TABLE IF NOT EXISTS birth_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    full_name TEXT,
    date_of_birth TEXT NOT NULL,
    time_of_birth TEXT NOT NULL,
    timezone TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    location_name TEXT NOT NULL,
    calculation_profile_version TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`).catch((err) => console.warn('Failed to auto-create SQLite table:', err));

// Auto-migrate schema for existing SQLite databases missing full_name column
client.execute(`ALTER TABLE birth_profiles ADD COLUMN full_name TEXT;`).catch(() => {
  // Ignore error if column already exists
});

