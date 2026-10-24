# FindAgain

A senior-friendly web app for saving where everyday items were placed and retrieving their last recorded location.

## Included
- Large, high-contrast controls and adjustable text size.
- Durable, user-scoped saved items using D1.
- Optional private photos using R2.
- Browser speech recognition, supported-browser voice entry, and speech synthesis.
- Search by item name, common aliases, or location.
- Update saved places and confirm removal of an item.
- ChatGPT identity supplied by the hosting platform; every record and photo request is authorized on the server.

Voice sentences use a limited parser and require review before saving. Retrieval uses text matching and aliases, not a large language model. Photos are not automatically analyzed. Results are last saved locations, not live tracking. Nothing is seeded into a user's account.

## Development
Follow the Sites workflow. This project uses pnpm, Vinext, React, and Cloudflare Workers. Generate schema migrations with the declared db:generate script. Hosting bindings are DB and BUCKET.

## Verification
Production compilation and TypeScript checks; search cases for natural questions, aliases, locations, missing items, and all items; SQLite checks for schema, owner isolation, and scoped updates/deletion. No browser QA was requested. WebMCP registration is feature-detected; a supported validation context was not available.

## Home Screen installation
Open the published site in Safari on iPhone/iPad and choose Share → Add to Home Screen. Leave Open as Web App enabled if shown. Includes a web manifest, standalone display mode, Apple touch icon, maskable Android icon, install guidance, and a public-only offline fallback. Saved records and photos always use the network and are never cached by the service worker. Device installation still needs a user action.

## Simplified interface
Two task tabs: Remember and Find. Remember offers voice, camera capture, and typing into What/Where, with one Save button. Find searches by voice or typed item name. Saved cards remain below both tasks; edit and removal use existing authorized endpoints. Camera images are resized in-browser to JPEG before upload. A generated elder-helper illustration plays a brief CSS greeting and respects reduced-motion preferences. Installation is a compact header action. Photos still require a human-entered item name and place; no automatic visual analysis is claimed.

Redesign checks: production build, TypeScript, voice sentence extraction, item/alias search, required inputs, camera capture configuration, and mascot asset presence. No browser or physical-device test was performed.

Find now supports explicit typed submission and automatic search after voice recognition. Both use one answer function and identical text/speech output. Ambiguous matches request a choice; missing matches never invent a location. Read aloud supports user-initiated playback when automatic speech is blocked. Checks cover query routing, synonym/typo matching, Unicode text, ambiguity, no-match and loading states.
