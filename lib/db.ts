import { createClient } from '@libsql/client';

export const db = createClient({
  // biome-ignore lint/style/noNonNullAssertion: Environment variables are required
  url: process.env.TURSO_DATABASE_URL!,
  // biome-ignore lint/style/noNonNullAssertion: Environment variables are required
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
