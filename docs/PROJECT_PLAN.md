# MeraResto — Master Project Plan & Product Design System
**Brand Name:** MeraResto  
**Category:** Multi-Restaurant SaaS Platform  
**Tagline:** *Your Restaurant, Your Digital World.*  
**Primary Domain:** `meraresto.in`  
**Version:** 1.0.0  

---

## 1. Product Identity & Brand Direction

### A. Brand Core Values
- **Empowerment:** Giving every dining establishment—from small tea stalls to high-end multi-outlet restaurants—an independent, enterprise-grade digital footprint.
- **Speed & Simplicity:** Zero friction for guests (no app download, no sign-up) and effortless operations for restaurant staff.
- **Reliability:** Real-time synchronization ensuring zero missed kitchen orders and accurate table-mapped billing.

### B. Visual Design System
- **Philosophy:** Minimalist, functional, and modern SaaS aesthetic (Linear/Vercel/Stripe caliber). No flashy distractions or excessive animations.
- **Color Palette:**
  - **Canvas (Backgrounds):** Pure white (`#FFFFFF`), Warm Off-White (`#FAFAFA`), Crisp Zinc Tint (`#F4F4F5`).
  - **Brand Primary (Deep Navy):** `#0B192C` (Primary headings, dark buttons, high-contrast badges), `#1E3E62` (Secondary brand elements).
  - **Brand Accent (Professional Teal):** `#008080` (Teal 600), `#0E8388` (Active indicators, focused states, primary action highlights).
  - **Functional Accents:**
    - Emerald (`#10B981` / `#059669`): In-stock, Live, Veg indicator, Served status.
    - Amber/Orange (`#F59E0B` / `#D97706`): Cooking status, Kitchen chimes, Warnings.
    - Rose/Crimson (`#EF4444` / `#DC2626`): Non-Veg indicator, Rejected status, Deletions.
- **Typography:**
  - Inter / System Sans font stack for clean legibility on both high-density desktop displays and mobile screens.
  - Strict typographic hierarchy: Display (`text-3xl / 4xl font-extrabold`), Section Headers (`text-xl font-bold`), Body (`text-sm font-normal`), Captions/Tags (`text-xs font-semibold uppercase tracking-wider`).

---

## 2. Platform Architecture Matrix

| Application | Domain | Primary Role | Tech Framework |
| :--- | :--- | :--- | :--- |
| **Website** | `meraresto.in` | Public Marketing & Conversion | Next.js 16 App Router |
| **Dashboard** | `app.meraresto.in` | Restaurant Manager Portal | Next.js 16 App Router |
| **Customer Menu** | `menu.meraresto.in` | Guest Mobile QR Menu & Ordering | Next.js 16 App Router |
| **Kitchen KDS** | `kitchen.meraresto.in` | Kitchen Display System | Next.js 16 App Router |
| **Super Admin** | `admin.meraresto.in` | Platform Operations & Billing | Next.js 16 App Router |

---

## 3. Strict Development Rules

1. **Inspect Before Modifying:** Never guess database column names or API contracts. Verify existing structures.
2. **Preserve Existing Functionality:** Protect working code paths; write non-breaking additive updates.
3. **Never Delete Live Data:** Do not drop existing tables or columns during database evolutions.
4. **Zero Duplicate Components:** Shared components belong strictly in `@meraresto/ui`.
5. **Enforce RLS Everywhere:** Never execute multi-tenant queries without verifying `restaurant_id` tenant scoping.
6. **Server-Side Price Authority:** Always validate order line items on the server before creating database records.
7. **Continuous Verification:** Run TypeScript type-checking (`tsc --noEmit`) and linting after every phase.

---
*End of Master Project Plan.*
