# Specification

## Summary
**Goal:** Apply a bright, colorful Amazon-style mobile-first marketplace theme consistently across the app (colors, buttons, cards, banners, and dashboards) without changing existing functionality.

**Planned changes:**
- Update global Tailwind theme tokens/CSS variables and shared utility classes to a light marketplace palette (orange primary, purple secondary, green success, red destructive), with rounded corners, soft card shadows, bold headings, and mobile-first spacing.
- Standardize primary buttons to a gradient-filled, rounded, bold style with soft shadow and responsive mobile tap/active feedback (respecting reduced-motion).
- Implement a consistent card design system (rounded white cards, soft shadow, clear borders, consistent hover/tap interactions) and apply it to product, vendor, dashboard, and category card usages across the app.
- Revise category cards (Home and Categories views) to near-square colorful gradient tiles with large icons and tap animation, preserving existing navigation behavior and category color mapping.
- Update product cards to a consistent mobile-first layout (image top, bold price, discount/offer presentation with strikethrough original where applicable, full-width gradient add-to-cart button with clear disabled/out-of-stock styling).
- Refresh hero/banner slider styling with gradient overlays, bold text, and themed CTA buttons while keeping existing swipe gestures, auto-rotation, and banner image assets intact.
- Refresh vendor/admin dashboards to use themed colored stat cards (sales/orders/wallet/alerts) aligned to the new palette, keeping all metrics/data logic unchanged.

**User-visible outcome:** The app UI looks and feels like a bright, modern mobile-first marketplace: consistent colors, gradient buttons, cohesive card styling, updated category/product cards, richer hero banners, and clearer themed dashboards—without any behavioral changes to navigation or data.
