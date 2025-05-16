import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts", // Path schema file
  out: "./src/db/migrations", // Directory where migrations will be stored
  dialect: "turso", // 'mysql' | 'postgres' | 'sqlite' | 'turso'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
});
