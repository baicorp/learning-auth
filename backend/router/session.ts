import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import { sessionDatabase, userDatabase } from "../../db";

const session = new Hono();

session.post("/sign-up", async (c) => {
  const { email, name, password, repeatPassword } = await c.req.json();

  if (!email || !name || !password || !repeatPassword) {
    //check if email, name, password, repeatPassword are required
    c.status(400);
    return c.json({
      message: "email, name, password, repeatPassword are required",
    });
  } else if (userDatabase.find((user) => user.email === email)) {
    //check if user already exists
    c.status(400);
    return c.json({
      message: "user already exists",
    });
  } else if (password !== repeatPassword) {
    //check if password and repeatPassword are same
    c.status(400);
    return c.json({ message: "password and repeatPassword must be same" });
  }

  // created hashed password to store in database
  const hashedPassword = await Bun.password.hash(password);

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
  };

  const newSession = {
    id: crypto.randomUUID(),
    userId: newUser.id,
  };

  userDatabase.push(newUser);
  sessionDatabase.push(newSession);

  setCookie(c, "session-id", newSession.id, { httpOnly: true });

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

  // check if user email is exitst
  const user = userDatabase.find((data) => data.email === email);
  if (!user || !user.password) {
    c.status(401);
    return c.json({
      message: "User not found",
    });
  }

  // check if password is correct
  const verify = await Bun.password.verify(password, user.password);
  if (!verify) {
    c.status(401);
    return c.json({
      message: "Incorrect password",
    });
  }

  // check user is already login
  const sessionId = getCookie(c, "session-id");
  if (sessionId) {
    //check if current user sessionCookies is available in session database
    const currentSession = sessionDatabase.find(
      (session) => session.id === sessionId
    );

    if (currentSession) {
      // check if userid from current session is the same as logged user
      if (currentSession.userId === user.id) {
        c.status(400);
        return c.json({
          message: "you are already logged in",
        });
      }
    }
  }

  const newSession = {
    id: crypto.randomUUID(),
    userId: user.id,
  };

  sessionDatabase.push(newSession);
  setCookie(c, "session-id", newSession.id, { httpOnly: true });

  return c.json({ success: true, message: "success sign-in" });
});

export default session;
