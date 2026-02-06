# Specification

## Summary
**Goal:** Upgrade the existing admin area into a fuller Admin Control Panel with dedicated Vendor Management and Orders Panel sections, including vendor approval/document viewing and order city filtering.

**Planned changes:**
- Update `/admin` landing page into a control panel with prominent navigation cards for “Vendor Management” and “Orders Panel”, while keeping existing admin sections accessible.
- Add Vendor Management section (UI + APIs) to list vendors from backend data and allow: approve/reject vendor, enable/disable vendor outlet, and view vendor documents with empty states and success/error feedback.
- Extend backend vendor model/endpoints to support admin-authorized vendor approval state updates and fetching vendor document metadata + retrievable blobs for viewing/downloading.
- Add Orders Panel section that displays all orders and adds a city filter (All/Kanpur/Unnao) while keeping existing order status display and status update behavior working.
- Extend backend order model so orders include a `city` field and ensure order creation populates it; return city with admin order queries for filtering.

**User-visible outcome:** Admins visiting `/admin` see a control panel with clear navigation into Vendor Management and Orders Panel, can manage vendors (approval, outlet status, documents), and can view all orders with a Kanpur/Unnao city filter while continuing to track/update order statuses.
