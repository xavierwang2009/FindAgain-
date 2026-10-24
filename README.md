# FindAgain

By Xavier Wang. A senior-friendly web app for saving where everyday items were placed and retrieving their last recorded location.

Deployment target: https://findagain.xavierwang-org.workers.dev

Status: source is prepared and locally tested. App deployment is pending; this address currently serves the Cloudflare starter. Google OAuth remains in testing mode.

## Features
- Sign in directly with Google; no ChatGPT account required.
- Private saved items and photos, separated by Google account identity.
- Large controls, adjustable text, camera uploads, browser voice entry and read-aloud.
- Search by item name, common aliases, or location; update and remove saved items.
- Add to Home Screen on supported phones and tablets.

Voice sentences use a limited parser and require review before saving. Retrieval uses text matching and aliases, not a large language model. Photos are not automatically analyzed. Results are last saved locations, not live tracking.

## Hosting and cost
Runs on Cloudflare Workers Free with D1. Photos are stored in bounded database chunks, so no R2 subscription is needed. Free-plan request and storage limits apply; service can stop when a limit is reached. This setup does not enable paid billing. D1 has a 500 MB limit per free database, shared by all users' records and photos.

This is a separate deployment from the earlier ChatGPT-hosted app. Records saved there are not automatically transferred to Google accounts.

## Development
Requires Node.js 22.13+ and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler d1 migrations apply findagain --local
pnpm dev
```

Place `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `APP_ORIGIN` in the ignored `.env.local` file. The production origin is configured in `wrangler.jsonc`. Register the exact `/auth/callback` URL with the Google OAuth web client for each environment used. Secrets must not be committed.

## Validate and deploy
```sh
pnpm exec tsc --noEmit
node --test tests/auth-storage.test.mjs
pnpm build
pnpm exec wrangler d1 migrations apply findagain --remote
pnpm exec wrangler deploy --config dist/server/wrangler.json
```

Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with Wrangler secrets before enabling sign-in. Google Auth Platform must have the production callback URL and an audience that permits the intended users. Database schema changes belong in `migrations/`.

Automated checks cover Google token validation, photo chunk round-trips, owner-scoped database access and session expiry. Local HTTP checks also exercised save, update, photo retrieval, cross-account denial, cross-origin denial, removal, invalid OAuth callback and logout. These checks do not establish live Google sign-in or physical-device microphone/camera behavior.
