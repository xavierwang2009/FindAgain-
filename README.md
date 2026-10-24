# FindAgain

By Xavier Wang. A device-only memory helper, hosted as a static website on ChatGPT Sites.

## Privacy and storage
- No sign-in, database server, photo uploads, or cloud backup.
- Items and photos are stored in this browser's IndexedDB. Search is local.
- Records do not sync across devices, browsers, or website addresses.
- Clearing site data or using private browsing can erase records. Anyone using the same browser profile can view them; the app adds no separate encryption/password.
- Optional voice typing uses the browser’s speech service, which may process audio in the cloud. Transcribed text is reviewed before local saving. Browser-agent access to saved items is disabled. Read-aloud only uses voices marked as on-device by the browser.
- The site still downloads its public HTML, scripts, CSS and images from its host. A Content Security Policy blocks app fetch connections (`connect-src 'none'`); browser-managed speech recognition is a separate service.

Existing records in the earlier cloud-backed version are not copied, accessed, or deleted by this version. The Google and Cloudflare setup is unused by this static app.

## Development
```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Checks and build
```sh
pnpm exec tsc --noEmit
pnpm test
pnpm build
pnpm start
```

Publish `dist/` as static assets using `.openai/hosting.json`. No runtime secrets are needed. Keep any old `.env.local` credentials out of source and deployment archives.

The app provides Remember and Find tabs, camera/photo selection, text input, editing, confirmed removal, larger text, and home-screen installation. Photos are not analyzed; locations are the last saved places, not live tracking.
