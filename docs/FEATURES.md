# MeraResto — Comprehensive Functional Feature Specifications
**Platform:** MeraResto Multi-Restaurant SaaS  
**Version:** 1.0.0  

---

## 1. Restaurant Owner & Manager Dashboard (`apps/dashboard` — `app.meraresto.in`)

### A. Authentication & Onboarding
- **Restaurant Registration:** Instant sign-up with business name, owner email, password, and custom URL slug verification.
- **Login & Session Management:** Secure cookie-based authentication with redirect memory.
- **Outlet Switcher:** Top-bar dropdown to switch between multiple branch locations for multi-outlet restaurant accounts.

### B. Profile & Branding Management
- **Restaurant Information:** Business name, tagline, description, contact phone, contact email, and full physical address.
- **Visual Branding:** Logo upload, cover banner, primary brand accent color picker, and operational currency (INR ₹, USD $, etc.).
- **Live Status Toggle:** One-click toggle to open or temporarily pause online restaurant ordering.

### C. Menu Catalog Management
- **Categories:** Add, edit, reorder (drag/sort order), and delete food categories (e.g. Starters, Main Course, Beverages, Desserts).
- **Dish Catalog:** Complete CRUD operations for food and beverage items:
  - Title, description, base price, and category assignment.
  - Image attachment via Supabase Storage.
  - Dietary classification: Green veg dot, red non-veg dot, vegan tag.
  - In-Stock / Out-of-Stock instant toggle.
  - Portion variants (Half, Full, Regular, Large) with custom pricing.
  - Add-ons and customization options (Extra cheese, dipping sauces, spice levels).
  - Quick inline price editing directly within table rows.

### D. Table & QR Code Management
- **Table Registry:** Management of physical tables with seating capacity and zone tagging (Indoor, Terrace, Patio, Bar).
- **Custom QR Generator:** Dynamic generation of unique, high-resolution QR codes mapped to specific tables.
- **Export & Printing:** Download table QR standees as PNG or print-ready PDF sheets for acrylic table stands.
- **Reception / Counter QR:** General entrance QR code allowing guests to scan and choose their table number at checkout.

### E. Live Order Management
- **Real-Time Order Feed:** Instantaneous websocket streaming of new incoming orders.
- **Audio Chime System:** Browser-based chime notification (`order-chime.mp3`) with toggle button.
- **Order Lifecycle Controls:** Action buttons to transition orders:
  - `Pending` → `Accepted` → `Preparing` → `Ready` → `Served` (or `Rejected`).
- **Order Details Card:** Table number, guest name, contact phone, timestamps, special cooking notes, and itemized dish breakdown.

### F. Reports & Analytics
- **KPI Metrics:** Daily gross revenue, total order volume, average check size, and peak order hours.
- **Order History:** Searchable and filterable archive of past orders with date range selectors.
- **Review Feed:** Customer star ratings (1 to 5) and dining feedback logs.

### G. Staff Management (RBAC)
- **Team Invitations:** Invite staff members via email.
- **Role Assignment:** Define scoped roles: `owner`, `manager`, `chef`, `waiter`, `cashier`.

---

## 2. Customer Digital QR Menu (`apps/customer-menu` — `menu.meraresto.in`)

### A. Digital Menu Experience
- **Zero Friction Access:** Opens in 0.8 seconds on any smartphone camera scan; no app store download, no login required.
- **Branded Header:** Displays restaurant logo, address, table number badge, and current operational status.
- **Category Navigation:** Sticky horizontal category selector with item counts.
- **Instant Search & Filters:** Fast client-side search across dish names and descriptions; Veg / Non-Veg filter pills.
- **Dish Cards:** Appetizing dish photography, dietary tags, preparation times, and clear pricing in local currency.

### B. Cart & Ordering Engine
- **Item Customization:** Selection of portion sizes (Regular / Large) and optional add-ons.
- **Cooking Instructions:** Guest text input for kitchen notes (e.g. "Less spicy", "No onions").
- **Cart Drawer:** Real-time subtotal calculation, quantity steppers, and tax summaries.
- **Checkout Process:** Table number confirmation, guest name, phone number (for SMS receipt/tracking), and order submission.

### C. Live Order Status Tracker
- **Real-Time Progress Stepper:** Live visual status updates:
  - Step 1: Order Placed & Received
  - Step 2: Accepted by Manager
  - Step 3: Cooking in Kitchen
  - Step 4: Ready to Serve
  - Step 5: Served at Table
- **Feedback & Review:** Direct in-browser 5-star rating and written review submission after meal completion.

---

## 3. Kitchen Display System — KDS (`apps/kitchen` — `kitchen.meraresto.in`)

### A. Fullscreen Kitchen Interface
- **Optimized for Tablets & Wall Displays:** High-contrast typography and color-coded order cards legible from 10 feet away.
- **Station Filtering:** Filter incoming items by kitchen prep station (e.g. Hot Kitchen, Tandoor, Cold Bar, Beverages).

### B. Order Card Lifecycle
- **Header:** Table number, order ID, elapsed timer with visual urgency indicators (green: <10m, yellow: 10-20m, red: >20m).
- **Line Items:** Bold quantities (`2x`, `1x`), dish names, variant indicators, and high-visibility cooking instructions.
- **One-Tap Actions:**
  - `Accept Order` (Transitions status to accepted).
  - `Start Cooking` (Transitions status to preparing).
  - `Mark Ready` (Alerts waitstaff that food is ready for delivery).
  - `Mark Served` (Clears order from active kitchen view).

### C. Audio Notifications & Alerts
- Distinctive chime alert sounds on every new incoming order.

---

## 4. Super Admin Platform (`apps/super-admin` — `admin.meraresto.in`)

### A. Platform Operations Dashboard
- **Aggregate Metrics:** Total registered restaurants, active dining tables, platform-wide gross merchandise value (GMV), daily active orders.
- **Platform Health:** API response times, Supabase database storage usage, and active realtime websocket connections.

### B. Restaurant & Tenant Management
- **Directory:** Searchable list of all registered restaurants across all tiers.
- **Tenant Controls:** View restaurant details, override status (Active / Suspended / Pending Verification), view outlet counts.

### C. Subscription & Plan Management
- **Plan Definitions:** Create and adjust subscription tiers (Starter, Pro Hospitality, Enterprise) with pricing and feature caps.
- **Billing Overrides:** Manual trial extensions, billing status updates, and custom enterprise plan assignments.

### D. Audit & Compliance
- **System Audit Logs:** Immutable log of sensitive platform actions (e.g. plan changes, tenant suspensions, admin logins).

---

## 5. Marketing & Lead Generation Website (`apps/website` — `meraresto.in`)

### A. Marketing Showcase
- **Hero Section:** Value proposition, live digital menu mockup, and free trial call-to-action buttons.
- **Interactive Product Demo:** Tab switcher allowing prospective clients to preview Customer View, Kitchen View, and Analytics.
- **Feature Highlights:** One-click QR printing, instant menu updates, dietary precision, and automated upselling.
- **ROI & Operational Proof:** Metric counters illustrating average check size growth and table turnover improvements.
- **Pricing Calculator:** Clear monthly vs. annual pricing comparison with feature breakdown.
- **Customer Testimonials:** Real restaurant partner reviews.
- **Conversion Footer & FAQ:** Comprehensive answers to common onboarding and hardware questions.

---
*End of Functional Feature Specifications.*
