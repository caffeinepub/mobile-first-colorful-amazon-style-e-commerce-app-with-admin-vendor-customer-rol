# Specification

## Summary
**Goal:** Make the app fully PWA installable with a complete manifest, icon set, service worker offline caching, and a mobile-first Add to Home Screen (A2HS) prompt.

**Planned changes:**
- Complete and mobile-first `manifest.webmanifest` (name/short_name, start_url `/`, scope `/`, standalone display, portrait orientation, theme/background colors matching the app’s orange theme) and ensure it aligns with the `<meta name="theme-color">` in `frontend/index.html`.
- Add and wire a full install icon set (including maskable) from `frontend/public/assets/generated/` into the manifest, and add Apple touch icon metadata pointing to the existing 180×180 icon.
- Ensure the service worker is enabled in production and implements offline behavior for main navigations by caching the app shell, serving cached shell when offline, falling back to `frontend/public/offline.html` when needed, and cleaning up old caches; avoid caching authenticated/private API responses.
- Implement a mobile-first in-app install CTA for Chrome mobile by capturing `beforeinstallprompt`, triggering the deferred prompt on tap, handling accepted/dismissed outcomes, and hiding the UI after `appinstalled`.

**User-visible outcome:** Users can install the app to their home screen (Android Chrome and iOS Safari), launch it in standalone mode with proper icons/theme, see a mobile-friendly install prompt on supported Chrome mobile, and still load the app shell (or offline fallback) when offline.
