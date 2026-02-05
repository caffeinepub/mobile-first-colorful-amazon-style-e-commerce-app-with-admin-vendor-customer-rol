# Specification

## Summary
**Goal:** Refresh the app UI to a light theme using an orange/yellow primary palette with blue secondary, green accent, and consistent orange→yellow gradient primary CTA buttons across all roles and pages.

**Planned changes:**
- Update Tailwind/shadcn global theme CSS variables (e.g., background/foreground, primary/secondary/accent and corresponding *-foreground tokens) to match: Primary = orange/yellow, Secondary = blue, Accent = green, Background = light grey/white, ensuring readable contrast across major surfaces.
- Apply the updated secondary (blue) and accent (green) tokens to relevant UI elements throughout the app so existing secondary/accent usages reflect the new palette.
- Implement and roll out a reusable primary CTA button style with a left-to-right orange→yellow gradient, including hover/active/focus states, without editing any files under `frontend/src/components/ui`, and ensure destructive actions keep destructive styling.
- Ensure any user-facing button text touched during this work remains in English.

**User-visible outcome:** The app displays a light grey/white theme with orange/yellow primary styling, blue secondary elements, green accents, and consistent orange→yellow gradient primary CTA buttons (with accessible text and focus states) across storefront, customer, vendor, and admin areas.
