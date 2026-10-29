# TechFest 2026 Portal (MERN) - Experiment 5

React (Vite) + Express + MongoDB Atlas. Secured with Helmet, express-mongo-sanitize,
express-validator, bcrypt, rate limiting and httpOnly/secure/sameSite cookies. CI on GitHub Actions.

## 1. Run locally
```bash
cd server && cp .env.example .env
# Set MONGO_URI and JWT_SECRET; for local development set
# NODE_ENV=development and CLIENT_URL=http://localhost:5173
npm ci && npm test && npm run dev

cd ../client && cp .env.example .env
# Set VITE_API_URL=http://localhost:5000 for local development
npm ci && npm run dev                 # http://localhost:5173
```

## 2. Demonstrate each vulnerability (on a TEST COPY), then fix
| Attack | How to show it | Fix in this project |
|---|---|---|
| NoSQL injection | Mount `server/demo/vulnerable-login.js` instead of the real login. POST `{"email":{"$ne":null},"password":{"$ne":null}}` -> logged in | `mongoSanitize()` + `express-validator` `.isString()` -> 400 |
| XSS | In Feedback.jsx use `dangerouslySetInnerHTML={{__html: f.message}}`, and remove `.escape()` in routes/feedback.js. Post `<script>alert('hi')</script>` -> popup | React text rendering + `.escape()` + Helmet CSP |
| Cookie theft / CSRF | Remove cookie options and show `document.cookie` exposes token | `httpOnly`, `secure`, `sameSite` + `X-Requested-With` check |

Take a before and after screenshot of each.

## 3. Git (steps 6-10 of the manual)
```bash
git --version
git init
git add .
git commit -m "first version: secured TechFest portal"
git branch -M main

# branching + merge
git checkout -b feature-page
# edit client/src/pages/Home.jsx (add a line), then:
git add . && git commit -m "feature: add welcome line on home page"
git checkout main
git merge feature-page

# deliberate merge conflict
git checkout -b conflict-a
# change line 5 of client/src/pages/Home.jsx to "Version A" ; commit
git add . && git commit -m "home text version A"
git checkout main
git checkout -b conflict-b
# change the SAME line to "Version B" ; commit
git add . && git commit -m "home text version B"
git checkout main
git merge conflict-a
git merge conflict-b            # CONFLICT shown
# open Home.jsx, keep the correct line, delete <<<<<<< ======= >>>>>>> markers
git add . && git commit -m "resolve merge conflict in Home.jsx"
git log --oneline --graph --all   # screenshot this

# push to GitHub (create an EMPTY repo on github.com first)
git remote add origin https://github.com/<username>/techfest-2026-portal.git
git push -u origin main
git push origin feature-page conflict-a conflict-b
```

## 4. CI (red then green)
`.github/workflows/ci.yml` runs backend tests and the frontend build on every push.
1. In `server/tests/app.test.js` change `expect(res.status).toBe(200)` to `toBe(500)` -> commit, push -> red cross (screenshot).
2. Change it back -> commit, push -> green tick (screenshot).

## 5. Cloud deployment
**MongoDB Atlas:** create free M0 cluster -> Database Access: add user/password -> Network Access: allow `0.0.0.0/0`
(fine for a lab; Render free tier has no fixed IP) -> Connect -> Drivers -> copy the connection string.

**Render (API):** New + > Web Service > connect repo.
Root Directory `server` | Build `npm install` | Start `npm start`
Environment: `MONGO_URI`, `JWT_SECRET` (long random), `CLIENT_URL` (your Netlify URL, no trailing slash), `NODE_ENV=production`.
Check `https://<api>.onrender.com/api/health`.

**Netlify (frontend):** Add new site > Import from GitHub. Base directory `client`, build `npm run build`, publish `dist`
(from `netlify.toml`). Environment variable `VITE_API_URL=https://<api>.onrender.com`.
`netlify.toml` already has the redirect so React Router pages work on refresh. (Vercel users: `vercel.json` does the same.)

After the first Netlify deploy, put the Netlify URL into Render's `CLIENT_URL` and redeploy the API.

## 6. Test live site
Open the https:// site, register, then confirm the new document in Atlas > Browse Collections > users.
The Render free tier sleeps after inactivity, so the first request can take about 50 seconds.

## 7. Performance (steps 16-17)
```bash
cd client && npm run build   # note file sizes printed by Vite; compare with an unoptimised build
```
Chrome > F12 > Lighthouse > Analyze page load. Save the report, fix at least 4 items
(alt text, image sizes, meta description, text compression, caching), rerun and record before/after scores.
Gallery is already lazy-loaded (`React.lazy` and `loading="lazy"`).

## 8. Report
Fill in the deployment report doc: URLs, screenshots, Lighthouse scores, device/browser table.
