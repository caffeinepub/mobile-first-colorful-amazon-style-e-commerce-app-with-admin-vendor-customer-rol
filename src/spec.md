# Specification

## Summary
**Goal:** Stop the `/admin` dashboard from crashing (React error #185) by making rendering defensive against transient/invalid analytics data and by gating dashboard rendering on a completed admin-role check.

**Planned changes:**
- Add render-safe guards and fallback formatting for all dashboard analytics fields to handle null/undefined/partial objects and invalid numbers (NaN/Infinity) without throwing.
- Prevent Recharts from rendering with invalid/empty data by validating chart inputs and showing an explicit empty-state UI when data is not usable.
- Add explicit loading/guard behavior so the AdminDashboardPage content does not render until the admin-role check has deterministically completed (loading state while checking; access denied for non-admin; normal dashboard for admin).

**User-visible outcome:** Visiting `/admin` no longer crashes; users see a stable loading state while admin access is being verified, non-admins see access denied, and admins see a dashboard that safely displays fallback values and clear empty states instead of crashing.
