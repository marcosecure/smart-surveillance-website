# Smart Surveillance Website — Local tools

This repo is a static site with optional local server to receive contact form submissions and utility scripts.

Quick start (install dependencies and run server):

```bash
npm install
npm run start-server
```

Scripts:
- `npm run rename-assets` — rename files in `assets/` replacing spaces with dashes and update references in root files.
- `npm run optimize-media` — convert JPG/PNG images under `assets/` to WebP and generate thumbnails (requires `sharp` native build).

Backend:
- `server/index.js` — simple Express endpoint `POST /api/contact` that saves to `server/contacts.json` and tries to send email if SMTP environment variables are set. See `server/.env.example`.

Deployment:
- For static hosting (Netlify/Vercel/GitHub Pages), run the rename script and deploy the repository. For form submissions, either use a server (this repo's `server/`) or a form service (Formspree, Netlify Forms).
# smart-surveillance-website

Static website for SMART SURVEILLANCE SOLUTIONS INC.

Deployment
----------

1. Create a new GitHub repository and push this project to it:

```bash
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

2. The repository includes a GitHub Actions workflow that will deploy the site to `gh-pages` branch automatically when you push to `main`.

3. Once the action completes, enable Pages in the repository settings (or use the Pages section) to serve the `gh-pages` branch.

If you prefer Netlify, run `npx netlify deploy --prod --dir=.` locally after installing Netlify CLI and connecting your account.

