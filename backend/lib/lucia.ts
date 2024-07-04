import { Lucia, TimeSpan } from "lucia";
import { db } from "./drizzle";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { usersTable, sessionTable } from "../db/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, usersTable);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, "s"), // if user not active for 30 seconds, session will expire and user will be logged out
  sessionCookie: {
    name: "bai-auth-session",
    // expires: true, // if set to true the database session automatically deleted expired session
    attributes: {
      secure: Bun.env.NODE_ENV === "production",
    },
  },
});
