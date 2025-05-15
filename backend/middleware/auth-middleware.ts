import { getCookie, setCookie } from "hono/cookie";
import { type Context, type Next } from "hono";
import { lucia } from "../lib/lucia";
import { usersTable } from "../db/schema";
import { db } from "../lib/drizzle";
import { eq } from "drizzle-orm";

export default async function userAuth(c: Context, next: Next) {
  const sessionCookie = getCookie(c, lucia.sessionCookieName);
  if (!sessionCookie) {
    c.status(401);
    // return c.json({ message: "unauthorized (no cookie)" });
    return c.redirect("/sign-in");
  }

  // validate sessionId from cookies browser
  const { user, session } = await lucia.validateSession(sessionCookie);
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    // return c.json({ message: "invalid session cookie" });
    return c.redirect("/sign-in");
  }

  //check if session is fresh
  if (session && session.fresh) {
    const newSession = await lucia.createSession(user.id, {});
    const newSessionCookie = lucia.createSessionCookie(newSession.id);
    setCookie(
      c,
      newSessionCookie.name,
      newSessionCookie.value,
      newSessionCookie.attributes
    );
  }

  // find user data that match current session
  const currentUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, user!.id));

  // check if there is a user
  if (currentUser.length === 0) {
    c.status(401);
    // return c.json({ message: "unauthorized (no user match with cookie)" });
    return c.redirect("/sign-in");
  }

  await next();
}
