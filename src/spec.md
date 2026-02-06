# Specification

## Summary
**Goal:** Enforce vendor commission accrual and wallet-limit outlet disabling, and add vendor outlet profile viewing/editing.

**Planned changes:**
- Update backend commission logic to add 10% commission to vendor wallet due only when an order transitions to "delivered", and ensure it applies exactly once per order.
- Enforce wallet limit rule in backend: when vendor.walletDue reaches/exceeds 1000 due to delivered-order commission, automatically set vendor outletStatus to "disabled".
- Update backend product listing behavior to hide products from customer-facing feeds when the product’s vendor outletStatus is disabled, while still returning the vendor’s own products in vendor-facing feeds.
- Add vendor UI wallet panel showing Wallet Due, Commission Rate (10%), and Limit (₹1,000), plus a prominent red warning banner when walletDue >= 1000 and/or outletStatus is disabled (English text).
- Add an "Outlet Profile" section (backend fields + UI) showing Outlet Name, Photo, Mobile, City, Area, masked Aadhaar display, and optional GST.
- Add "Edit Outlet" functionality for vendors to update outlet profile fields (including outlet photo), persist changes to backend, and refresh vendor profile data immediately after saving.

**User-visible outcome:** Vendors see their wallet due, commission rate, and limit; receive a red warning when the wallet limit is reached/disabled; can view and edit their outlet profile (with Aadhaar masked). Customers no longer see products from disabled vendor outlets.
