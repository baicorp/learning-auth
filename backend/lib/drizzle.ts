import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database("./backend/db/bun-hono.sqlite");
export const db = drizzle(sqlite);
