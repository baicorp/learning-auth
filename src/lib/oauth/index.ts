import { Google, GitHub } from "arctic";

const google = new Google(
  process.env.GOOGLE_OAUTH_CLIENT_ID!,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
  process.env.BASE_URL + "/api/auth/oauth/google/callback"
);

const github = new GitHub(
  process.env.GITHUB_OAUTH_CLIENT_ID!,
  process.env.GITHUB_OAUTH_CLIENT_SECRET!,
  {
    redirectURI: process.env.BASE_URL + "/api/auth/oauth/github/callback",
  }
);

export { google, github };
