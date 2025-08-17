# Notes CRUD – JavaScript vs TypeScript (GitHub + Amplify Hosting, no installs)

This repository is designed for use in a teaching environment where students cannot install local tooling.
Learners fork the repo, edit files in GitHub’s web editor (or Codespaces), and deploy via AWS Amplify Hosting.
The backend is defined in code (Amplify Gen 2) and deployed automatically on first build.

## Quick start
1. Fork the repo.
2. In Amplify Hosting: New app → Host web app → connect your fork (`main` branch) → set root to `apps/js` → build `npm install && npm run build` → output `dist`.
3. Open the deployed URL and create a few notes.
4. Create a new branch `typescript-version` and deploy the TS app from `apps/ts` similarly.
5. Compare the developer experience across JS and TS.

## Security note (for teaching only)
The API uses a public API key for minimal friction. For summative assessments, switch to authenticated access.


---
### Note on configuration
The frontend now fetches `/amplify_outputs.json` at runtime and calls `Amplify.configure(outputs)` in `src/main.(jsx|tsx)`. 
Do not import this JSON at build time; it does not exist until the app is deployed.


---
### CI note
The build now runs:
- `npx ampx pipeline-deploy` to deploy the backend for the current `$AWS_BRANCH`.
- `npx ampx generate outputs --out-dir public` to emit `public/amplify_outputs.json`, which Vite copies to `dist/` so the app can fetch it at runtime.
