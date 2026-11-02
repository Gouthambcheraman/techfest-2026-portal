# TechFest Portal

A responsive React + Vite frontend and Express API for the college TechFest portal. The API uses MongoDB/Mongoose for user accounts and feedback.

## Requirements

- Node.js 20 or newer
- MongoDB connection URL (local or hosted)

## Configure and run

1. Install dependencies:

   ```powershell
   npm.cmd install
   ```

2. Create a local environment file and edit it with your MongoDB URL and a newly generated JWT secret:

   ```powershell
   Copy-Item .env.example .env
   ```

   Set `MONGODB_URI` to the MongoDB Atlas connection URL you want to use. The API explicitly selects the `techfestdb` database even if the URI ends after the hostname with `/`. Set `JWT_SECRET` to a random value of at least 32 characters. Never commit `.env`.

   For production, set `NODE_ENV=production`, use a production MongoDB database in `MONGODB_URI`, and set `FRONTEND_ORIGIN` to the exact HTTPS origin serving the frontend (for example, `https://techfest.example.edu`, without a trailing path). The API refuses to start in production if that origin is missing or not HTTPS. `NODE_ENV=production` enables the Secure authentication cookie.

3. Start the API and frontend:

   ```powershell
   npm.cmd run dev
   ```

   Before accepting requests, the API connects to `techfestdb`, checks the legacy `user` collection, and initializes `users` and `feedback` plus their Mongoose indexes. If `user` has documents, startup stops and reports the count without deleting it. If `user` exists and is empty, startup drops only that empty legacy collection. If it is absent, no drop is attempted. Initialization is safe to repeat.

   The frontend runs at `http://localhost:5173`, and the API runs at `http://localhost:5000`. Vite proxies `/api` requests to the API.

4. Create a production frontend build:

   ```powershell
   npm.cmd run build
   ```

   Start the API with `npm.cmd start`. Configure the frontend host to serve the generated `dist` folder and proxy `/api` to the API server.

## Render deployment

The root `render.yaml` defines two Render services: an Express API web service (`techfest-api`) and a static frontend (`techfest-web`). Review the service names and matching origins in `render.yaml` before creating the Blueprint; Render service names must be available.

The commands and paths are:

| Service | Build command | Start/publish |
|---|---|---|
| API (`server/` is the application source; repository root is the service root) | `npm ci` | `npm start` |
| Frontend (repository root) | `npm ci && npm run build` | Publish `dist/`; SPA routes rewrite to `/index.html` |

Set these environment variables for the API service:

- `NODE_ENV=production`
- `MONGODB_URI` — Atlas connection string for `techfestdb`; configure it as a secret in Render.
- `JWT_SECRET` — Render generates a value from the Blueprint; keep it private and at least 32 characters.
- `FRONTEND_ORIGIN=https://techfest-web.onrender.com` — exact HTTPS origin of the static service.
- `PORT` is assigned by Render and is read by the API automatically.

The frontend service uses `VITE_API_BASE_URL=https://techfest-api.onrender.com/api`. Vite embeds this value at build time. If either Render service has a different assigned hostname, update both the frontend API URL and the API's `FRONTEND_ORIGIN` to match, then redeploy. The Axios client sends credentialed requests for the HTTP-only auth cookie.

In the Render dashboard, connect the GitHub repository, select `render.yaml` as the Blueprint, provide the Atlas `MONGODB_URI` when prompted, and review the service names and environment values before applying. This repository configuration does not deploy the application by itself.

## API

- `POST /api/auth/register` — create an account and set an HTTP-only session cookie
- `POST /api/auth/login` — authenticate and set the session cookie
- `GET /api/auth/me` — return the current authenticated user
- `POST /api/auth/logout` — clear the session cookie
- `POST /api/feedback` — save feedback for the authenticated user
- `GET /api/feedback/my` — return that user's feedback
- `GET /api/health` — API and database connection status

The application models explicitly map to exactly two MongoDB collections: `users` and `feedback`. Startup creates either collection only when missing. Feedback ownership and account details are taken from the authenticated session, not the submitted feedback body.
