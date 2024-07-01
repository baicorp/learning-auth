import { Hono } from "hono";
import { logger } from "hono/logger";
import { movies, OAuth, session } from "./router";
import authMiddleware from "./middleware/auth-middleware";
import { deleteCookie, getCookie } from "hono/cookie";
import { sessionDatabase, userDatabase } from "../db";

const app = new Hono().basePath("/api/auth");
app.use(logger());

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.get("/current-user", (c) => {
  const session = getCookie(c, "session-id");

  if (!session) {
    c.status(401);
    return c.json({ message: "unauthorized" });
  }

  const currentSession = sessionDatabase.find(
    (sessiondb) => sessiondb.id === session
  );
  if (!currentSession) {
    c.status(401);
    return c.json({ message: "unauthorized" });
  }

  const user = userDatabase.find((user) => user.id === currentSession.userId);
  if (!user) {
    c.status(401);
    return c.json({ message: "unauthorized" });
  }

  return c.json(user);
});

app.get("/logout", async (c) => {
  const session = getCookie(c, "session-id");
  if (!session) {
    return c.json({ message: "success logout" });
  }

  const currentSessionIndex = sessionDatabase.findIndex(
    (sessiondb) => sessiondb.id === session
  );

  // detelete current session inside session database
  if (currentSessionIndex) sessionDatabase.splice(currentSessionIndex, 1);
  // detelete current sessionCookies
  deleteCookie(c, "session-id");

  c.status(200);
  return c.json({ message: "success logout" });
});

app.route("/session", session);
app.route("/oauth", OAuth);

//use middleware auth to protect all api/movies/* routes
app.use("/movies/*", authMiddleware);
app.route("/movies", movies);

const server = Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log(`Listening on localhost : ${server.port}`);
console.log(`database : `, userDatabase);
