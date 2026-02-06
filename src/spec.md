# Specification

## Summary
**Goal:** Fix Internet Identity admin login and rebuild consistent role-based access across the app using exactly three roles (admin/vendor/customer), including safe bootstrapping and non-crashing route guards.

**Planned changes:**
- Rebuild the backend canonical role model and authorization checks to use only `admin`, `vendor`, and `customer`, mapping any legacy `user` role semantics to `customer`.
- Add backend bootstrap behavior: first registered user becomes `admin`; all subsequent new users default to `customer` unless explicitly assigned otherwise.
- Add backend “ensure admin exists” behavior: if there are zero admins in persistent state, allow an authenticated caller to become `admin` via a single backend call path; if an admin already exists, prevent arbitrary self-promotion.
- Fix the end-to-end admin assignment flow so assigning the current Internet Identity principal as `admin` immediately unlocks `/admin` routes via React Query refetch/invalidations, without requiring a crash/reload and without relying on `caffeineAdminToken` URL parameters.
- Update frontend route guards/role wrappers to use `admin`/`vendor`/`customer` and migrate any `requiredRole="user"` usage to `requiredRole="customer"`.
- Harden `RequireRole` so missing/undefined user/role/actor/query states render a loading/skeleton state instead of crashing or incorrectly denying access.

**User-visible outcome:** Users can log in with Internet Identity and reliably access customer/vendor/admin areas based on their role; the first user (or a zero-admin state) can bootstrap admin safely; and navigating to guarded routes (including `/admin`) no longer crashes while role data is loading.
