# Specification

## Summary
**Goal:** Ensure admin routes never appear blank by handling actor initialization failures and runtime render exceptions with clear, actionable diagnostics.

**Planned changes:**
- Detect React Query actor initialization error states for admin routes and render an explicit error/denied screen instead of a blank page or infinite loading skeleton.
- Update `frontend/src/components/auth/RequireRole.tsx` to be actor-query-state aware: show loading while pending, proceed on success, and show an admin diagnostics-enabled AccessDenied screen (including the actor error message when available) when identity exists but actor init failed.
- Add a single, structured console log when entering the actor-initialization-failed path (include principal if available, actor query status, and whether `caffeineAdminToken` is present).
- Add an error boundary around admin pages so render-time exceptions show a visible English fallback UI with a safe navigation option (e.g., Go to Home) without affecting non-admin routes.

**User-visible outcome:** Visiting `/admin`, `/admin/products`, `/admin/vendors`, or `/admin/orders` will show a clear English error/diagnostics screen (or a fallback UI on crashes) instead of a blank page, with guidance to retry/refresh and safe navigation.
