import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:vedica.db',
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

