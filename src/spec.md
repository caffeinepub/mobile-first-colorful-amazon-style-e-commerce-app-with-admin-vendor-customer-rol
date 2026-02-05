# Specification

## Summary
**Goal:** Add a mobile-first, colorful onboarding flow for Customers and Vendors, including customer vendor discovery and a simple vendor onboarding dashboard.

**Planned changes:**
- Replace the current Home page content with a mobile-first landing screen featuring two large rounded primary actions: “Customer Login” and “Vendor Login”, each navigating to its respective flow.
- Add a Customer Login Form with required fields (Name, Mobile number, City dropdown: Kanpur/Unnao, Area, Pin code), validation messaging in English, and navigation to the Vendor List while preserving the selected city.
- Add a Vendor List page that filters vendors by the selected city and displays rounded vendor cards with Shop name, Area, Mobile number, and a “View Shop” button; handle missing city with an English prompt and a way to return to Customer Login.
- Add a minimal Vendor Shop screen/route that opens from “View Shop” and clearly shows which shop was selected (at least shop name, plus city/area).
- Add a Vendor Login Form with required fields (Name, Mobile, City dropdown: Kanpur/Unnao, Area, Pin code), validation in English, and navigation to the Outlet Details form while preserving entered info.
- Add an Outlet Details form with required fields (Outlet name, Outlet photo upload with preview/filename, Outlet mobile, Aadhar number) and optional GST; on submit, navigate to a simple Vendor Dashboard and display submitted outlet details (at least Outlet name).
- Add a simple Vendor Dashboard page/route with a clean mobile-first summary card layout.
- Apply a consistent modern colorful theme across all new screens using rounded cards, large touch-friendly buttons, soft shadows, and a coherent non-blue/non-purple palette; ensure all user-facing text is in English.

**User-visible outcome:** Users land on a two-choice login screen, can complete a Customer form to see a city-filtered vendor list and open a selected shop screen, or complete a Vendor login + outlet details flow to reach a simple vendor dashboard showing their submitted outlet info.
