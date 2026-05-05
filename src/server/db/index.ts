import { existsSync, readFileSync } from 'node:fs';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/env';
import * as schema from './schema';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const RDS_CERT_PATH = '/app/certs/global-bundle.pem';
const ssl = existsSync(RDS_CERT_PATH)
  ? { ca: readFileSync(RDS_CERT_PATH).toString() }
  : { rejectUnauthorized: false };

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL, { ssl });
if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
