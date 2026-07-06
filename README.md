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

