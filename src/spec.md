# Specification

## Summary
**Goal:** Replace role-based admin route gating with a login-only bypass and simplify/stabilize the admin dashboard.

**Planned changes:**
- Remove `SafeAdminGate` and any role-based route guard logic from all `/admin*` routes, keeping admin pages wrapped by `AdminErrorBoundary`.
- Add `AdminBypass` wrapper that only checks whether the user is logged in; redirect unauthenticated users to `/customer-login`, render children when authenticated, and show a simple loading state while auth initializes.
- Rebuild `AdminDashboardPage` with a minimal, stable layout while preserving: vendor list display, wallet due display, and enable/disable outlet status via the existing mutation, with safe handling for empty/loading/error states.

**User-visible outcome:** Admin routes work reliably with login-only access (no role checks), and the admin dashboard loads with a simpler, more stable UI while retaining existing vendor management and wallet due functionality.
