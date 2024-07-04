import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { lucia } from "../lib/lucia";
import { db } from "../lib/drizzle";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

const session = new Hono();

session.post("/sign-up", async (c) => {
  const { email, name, password, repeatPassword } = await c.req.json();

  if (!email || !name || !password || !repeatPassword) {
    //check if email, name, password, repeatPassword are required
    c.status(400);
    return c.json({
      message: "email, name, password, repeatPassword are required",
    });
  }

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  //check if user already exists
  if (user.length !== 0) {
    c.status(400);
    return c.json({
      message: "user already exists",
    });
  }

  if (password !== repeatPassword) {
    //check if password and repeatPassword are same
    c.status(400);
    return c.json({ message: "password and repeatPassword must be same" });
  }

  // created hashed password to store in database
  const hashedPassword = await Bun.password.hash(password);

  const newUser = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: usersTable.id });

  if (newUser.length === 0 && !newUser[0].id) {
    c.status(400);
    return c.json({ message: "Failed to signup" });
  }

  //create new session for user
  const session = await lucia.createSession(newUser[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  setCookie(
    c,
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  c.status(200);
  return c.json({ success: true, message: "success sign-up" });
});

session.post("/sign-in", async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    c.status(400);
    return c.json({
      message: "email and password are required",
    });
  }

  // check if user exists in database
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (user.length === 0 || !user[0].password) {
    c.status(401);
    return c.json({
      message: "User not found",
    });
  }

  // check if password is correct
  const verify = await Bun.password.verify(password, user[0].password);
  if (!verify) {
    c.status(401);
    return c.json({
      message: "Incorrect password",
    });
  }

  const session = await lucia.createSession(user[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  setCookie(
    c,
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return c.json({ success: true, message: "success sign-in" });
});

export default session;
