import { createClient } from '@libsql/client';

export const db = createClient({
  // biome-ignore lint/style/noNonNullAssertion: Environment variables are required
  url: process.env.TURSO_DATABASE_URL!,
  // biome-ignore lint/style/noNonNullAssertion: Environment variables are required
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
