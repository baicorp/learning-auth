# Learning Authentication with Cookies and OAuth

This project is part of my learning journey about creating authentication API endpoints using cookies and OAuth methods with [Bun](https://bun.sh/), [Hono](https://hono.dev/), and [Arctic](https://arctic.js.org/) for OAuth, alongside a [React](https://react.dev/) frontend built with [Vite](https://vitejs.dev/).

## Prerequisites
* [Bun](https://bun.sh/)
* [Git](https://git-scm.com/)

## Installation
```bash
git clone https://github.com/baicorp/learning-auth.git
cd learning-auth
bun install
cd frontend
bun install
```

## Get the client ID and client secret from Google and GitHub
* [create new OAuth github](https://github.com/settings/developers)
* [create new google cloud project](https://console.cloud.google.com/)

## Create .env file in root dir ./learning-auth
```bash
BASE_URL="http://localhost:3000"

GOOGLE_OAUTH_CLIENT_ID="your_google_client_id"
GOOGLE_OAUTH_CLIENT_SECRET="your_google_client_secret"

GITHUB_OAUTH_CLIENT_ID="your_github_client_id"
GITHUB_OAUTH_CLIENT_SECRET="your_github_client_secret"
```

## start backend dev server 
  ```bash
  cd learning-auth
  bun run dev
  ```
## start frontend dev server
  ```bash
  cd learning-auth/frontend
  bun run dev
  ```

