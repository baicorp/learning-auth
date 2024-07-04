import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./backend/db/schema.ts", // Path schema file
  out: "./backend/db/migrations", // Directory where migrations will be stored
  dialect: "sqlite", // 'mysql' | 'postgres' | 'sqlite'
  dbCredentials: {
    url: "./backend/db/bun-hono.sqlite", // Path to SQLite database if using SQLite locally
  },
  verbose: true,
  strict: true,
});
