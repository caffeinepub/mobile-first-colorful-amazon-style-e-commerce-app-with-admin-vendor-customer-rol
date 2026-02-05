# Specification

## Summary
**Goal:** Rename the app branding to “QuickBazar” and update the logo + PWA icons to match the new branding.

**Planned changes:**
- Replace all user-facing “ShopHub” branding text with “QuickBazar” across the UI and app metadata (HTML title, Apple web app title meta, and PWA manifest name/short_name).
- Remove the current header logo image reference and switch the TopNav to a newly generated QuickBazar logo stored under `/assets/generated/`, with updated alt text.
- Regenerate and replace the existing PWA icon image files (keeping the same filenames/paths) so installed app icons reflect the new QuickBazar branding.

**User-visible outcome:** The app shows “QuickBazar” everywhere instead of “ShopHub”, displays a new QuickBazar logo in the header, and the installed PWA/Home Screen icon updates to the new branding.
