# Specification

## Summary
**Goal:** Make the UI more colorful and visually rich across the storefront and customer/vendor/admin portals using the existing theme palette, while preserving readability in light and dark modes.

**Planned changes:**
- Apply more intentional palette usage (primary orange/yellow, secondary blue, accent green) across key UI surfaces: headers/nav, section headers, cards, chips/badges, focus states, and empty states (beyond just primary CTA buttons).
- Add subtle gradients and tinted backgrounds (using existing Tailwind theme tokens) to hero/banner overlays, category tiles, and key callout cards; make hover/active/focus states more vibrant while keeping the UI clean and not visually noisy.
- Standardize status/badge styling (order statuses, stock/availability, success/error/info) so the same status value renders with consistent, readable, palette-aligned colors across customer, vendor, and admin pages.
- Ensure contrast/readability remains strong in both light and dark modes and avoid modifying immutable shadcn/ui component source files.

**User-visible outcome:** Storefront pages (Home, Categories, Product, Cart, Checkout) and Admin/Vendor dashboards look more colorful and polished, with clearer interactive states and consistent, easy-to-read status indicators throughout.
