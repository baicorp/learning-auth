import { getCookie } from "hono/cookie";
import { type Context, type Next } from "hono";
import { sessionDatabase, userDatabase } from "../../db";

export default async function userAuth(c: Context, next: Next) {
  console.log(sessionDatabase);
  const session = getCookie(c, "bai-session-auth");
  if (!session) {
    c.status(401);
    return c.json({ message: "unauthorized" });
  }
  //check if session available in session database
  const valid = sessionDatabase.filter((data) => data.id === session);
  if (valid.length === 0) {
    c.status(401);
    return c.json({ message: "unauthorized" });
  }

  //check the current user loggin
  const currentUser = userDatabase.find((user) => user.id === valid[0].userId);
  console.log(currentUser);

  await next();
}
