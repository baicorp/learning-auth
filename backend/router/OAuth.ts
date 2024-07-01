import { Hono } from "hono";
import { html, raw } from "hono/html";
import { generateState, generateCodeVerifier } from "arctic";
import { getCookie, setCookie } from "hono/cookie";
import { google, github } from "../lib/oauth";
import { sessionDatabase, userDatabase } from "../../db";
import type { SessionDatabase, UserDatabase } from "../type";

const OAuth = new Hono();

OAuth.get("/google/getConcentScreen", async (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  setCookie(c, "state", state, { httpOnly: true });
  setCookie(c, "codeVerifier", codeVerifier, { httpOnly: true });

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  return c.json({ message: "success", url: url.toString() });
});

OAuth.get("/google/callback", async (c) => {
  const url = new URL(c.req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    c.status(400);
    return c.json({ message: "invalid code or state" });
  }

  const cookieState = getCookie(c, "state");
  const cookieCodeVerifier = getCookie(c, "codeVerifier");

  if (!cookieState || !cookieCodeVerifier) {
    c.status(400);
    return c.json({ message: "invalid request" });
  }

  if (cookieState !== state) {
    c.status(400);
    return c.json({ message: "invalid request" });
  }

  const { accessToken } = await google.validateAuthorizationCode(
    code,
    cookieCodeVerifier
  );

  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const user = await response.json();

  // find if the user is already registered
  const registeredUser = userDatabase.find(
    (userdb) => userdb.email === user.email
  );

  // if user is not registered then add new user and create new session
  if (!registeredUser) {
    const newUser: UserDatabase = {
      id: crypto.randomUUID(),
      email: user.email,
      name: user.name,
      picture: user.picture,
    };
    const newSession: SessionDatabase = {
      id: crypto.randomUUID(),
      userId: newUser.id,
    };

    userDatabase.push(newUser);
    sessionDatabase.push(newSession);

    setCookie(c, "session-id", newSession.id, { httpOnly: true });
    // return html that close popup tab
    return c.html(`
    <html>
      <body>
        <script>
          window.close();
        </script>
      </body>
    </html>
    `);
  }

  // if user registered then add new session for registeredUser
  const newSession: SessionDatabase = {
    id: crypto.randomUUID(),
    userId: registeredUser.id,
  };

  sessionDatabase.push(newSession);
  setCookie(c, "session-id", newSession.id, { httpOnly: true });

  // return html that close popup tab
  return c.html(`
    <html>
      <body>
        <script>
          window.close();
        </script>
      </body>
    </html>
    `);
});

OAuth.get("/github/getConcentScreen", async (c) => {
  const state = generateState();
  setCookie(c, "state", state);
  const url: URL = await github.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });

  c.status(200);
  return c.json({ message: "success", url: url.toString() });
});

OAuth.get("/github/callback", async (c) => {
  const url = new URL(c.req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    c.status(400);
    return c.json({ message: "no code inside searchParams" });
  }

  const cookieState = getCookie(c, "state");
  if (!cookieState) {
    c.status(400);
    return c.json({ message: "invalid request (state)" });
  }

  const { accessToken } = await github.validateAuthorizationCode(code);
  if (!accessToken) {
    c.status(400);
    return c.json({ message: "invalid accessToken" });
  }

  //to get user profile
  const responseUserProfile = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  //to get user email
  const responseUserEmail = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userProfile = await responseUserProfile.json();
  const userEmail = await responseUserEmail.json();

  // find if the user is already registered
  const registeredUser = userDatabase.find(
    (user) => user.email === userEmail[0].email
  );

  // if user is not registered then add new user and create new session
  if (!registeredUser) {
    const newUser: UserDatabase = {
      id: crypto.randomUUID(),
      email: userEmail[0].email,
      name: userProfile?.name,
      picture: userProfile?.avatar_url,
    };
    const newSession: SessionDatabase = {
      id: crypto.randomUUID(),
      userId: newUser.id,
    };

    userDatabase.push(newUser);
    sessionDatabase.push(newSession);
    setCookie(c, "session-id", newSession.id, { httpOnly: true });

    // return html that close popup tab
    return c.html(`
      <html>
      <body>
      <script>
      window.opener.postMessage("success");
      window.close();
      </script>
      </body>
      </html>
    `);
  }

  // if user registered then add new session for registeredUser
  const newSession: SessionDatabase = {
    id: crypto.randomUUID(),
    userId: registeredUser.id,
  };

  sessionDatabase.push(newSession);
  setCookie(c, "session-id", newSession.id, { httpOnly: true });

  // return html that close popup tab
  return c.html(`
    <html>
    <body>
    <script>
    window.opener.postMessage("success");
    window.close();
    </script>
    </body>
    </html>
  `);
});

export default OAuth;
