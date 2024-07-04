import { Hono } from "hono";
import { logger } from "hono/logger";
import { movies, OAuth, session } from "./router";
import authMiddleware from "./middleware/auth-middleware";
import { getCookie, setCookie } from "hono/cookie";
import { lucia } from "./lib/lucia";
import { db } from "./lib/drizzle";
import { usersTable } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Hono().basePath("/api/auth");

app.use("*", logger());

app.get("/current-user", async (c) => {
  const sessionCookie = getCookie(c, lucia.sessionCookieName);
  if (!sessionCookie) {
    c.status(401);
    return c.json({ message: "unauthorized (no cookie)" });
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
    return c.json({ message: "unauthorized (no user match with cookie)" });
  }

  return c.json(currentUser[0]);
});

app.get("/logout", async (c) => {
  const session = getCookie(c, lucia.sessionCookieName);
  if (!session) {
    return c.json({ message: "success logout" });
  }

  // detelete current session inside session database
  const sessionCookie = lucia.createBlankSessionCookie();
  setCookie(
    c,
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  c.status(200);
  return c.json({ message: "success logout" });
});

app.route("/session", session);
app.route("/oauth", OAuth);
app.use("/movies/*", authMiddleware);
app.route("/movies", movies);

const server = Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log(`Listening on localhost : ${server.port}`);
