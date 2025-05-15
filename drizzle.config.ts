import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts", // Path schema file
  out: "./src/db/migrations", // Directory where migrations will be stored
  dialect: "sqlite", // 'mysql' | 'postgres' | 'sqlite'
  dbCredentials: {
    url: "./src/db/bun-hono.sqlite", // Path to SQLite database if using SQLite locally
  },
  verbose: true,
  strict: true,
});
