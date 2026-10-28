# 🤖 QResto – AI Build Plan (Prompt-by-Prompt Guide)

> Is file ko AI (Claude Code / Cursor / Claude chat) ke saath use karo. Har step me ek **ready-to-paste prompt** hai. Ek prompt → AI code banaye → aap test karo → tick karo → agla prompt.

---

## 📊 Progress Tracker

| Phase | Kaam | Prompts | Status |
|-------|------|---------|--------|
| 0 | AI Setup + Master Context | 2 | ✅ Done |
| 1 | Project Setup | 3 | ✅ Done |
| 2 | Supabase Database | 5 | ✅ Done |
| 3 | Manager Auth + Hotel Setup | 4 | ✅ Done |
| 4 | Menu Management (Manager) | 5 | ✅ Done |
| 5 | Customer Menu + Cart | 6 | ✅ Done |
| 6 | Ordering System | 5 | ✅ Done |
| 7 | Manager Orders + Realtime | 4 | ✅ Done |
| 8 | QR Code System | 3 | ✅ Done |
| 9 | Reviews & Ratings | 3 | ✅ Done |
| 10 | UI Polish + Responsive | 3 | ✅ Done |
| 11 | Testing + Security | 4 | ✅ Done |
| 12 | Deployment (Production Ready) | 3 | ⏳ 12.1 Done, Deploy Ready |
| 13 | Future Features | 4 | ⬜ |

**Total: 48 / 54 prompts done**

---

## 🧠 AI ke saath kaam karne ke Golden Rules

1. **Ek time par ek hi prompt** do. Bade prompt me AI galti karta hai.
2. Har prompt ke baad **khud run karke test** karo (`npm run dev`).
3. Error aaye to **pura error message copy-paste** karo AI ko.
4. Har phase complete hone par **git commit** karo (`git commit -m "phase 3 done"`).
5. AI ko **kabhi secret keys mat do** (service role key, passwords). Sirf `.env.local` me rakho.
6. Agar AI bhatak jaye to naya chat shuru karo aur **Master Context** (Phase 0) dobara paste karo.
7. Har prompt ke end me ye line add karna acchi aadat hai: *"Pehle plan batao, phir code likho. Sirf zaroori files badlo."*

---

## 🔧 PHASE 0 – AI Setup & Master Context

### Recommended AI Tools
| Tool | Kab use kare |
|------|--------------|
| **Claude Code** (terminal) | Poora project banane ke liye, files khud edit karta hai (best) |
| **Cursor / VS Code + AI** | Editor ke andar coding |
| **Claude chat** | Doubts, SQL, debugging |

### ✅ Prompt 0.1 – Master Context (Har naye chat me sabse pehle paste karo)

```
Tum ek senior full-stack developer ho. Hum "QResto" naam ka Digital QR Hotel Menu & Ordering App bana rahe hain.

PROJECT:
Customer table par lage QR ko scan kare, hotel ka menu dekhe (naam, photo, price, category), cart me items daale aur order place kare, phir rating/review de. Hotel manager login karke hotel details, menu items (add/edit/delete, price, availability), orders (accept/reject/status update) aur reviews manage kare. Har hotel/table ka unique QR hoga.

TECH STACK:
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage, Realtime)
- QR: qrcode.react
- Cart state: Zustand
- Deploy: Vercel

RULES:
- Mobile-first responsive UI.
- Clean, chhoti reusable components. Folder structure: app/, components/, lib/, store/, types/.
- Customer ko login nahi chahiye; manager ko Supabase Auth se login.
- Supabase RLS hamesha ON rahe.
- Order total hamesha server/DB ke price se calculate ho, client ke price par bharosa nahi.
- Pehle plan batao, phir code likho. Sirf zaroori files badlo. Har step ke baad batao main kaise test karun.
- Hindi/Hinglish me explain karo, code English me.

Samajh gaye to bas "Ready" likho.
```

### ✅ Prompt 0.2 – Folder structure fix karwana

```
Is project ke liye final folder structure suggest karo (app router) jisme ye routes hon:
/ (landing), /login, /signup, /menu/[slug], /menu/[slug]/cart, /order/[id],
/dashboard, /dashboard/orders, /dashboard/menu, /dashboard/reviews, /dashboard/qr, /dashboard/settings.
Sirf tree dikhao, abhi code mat likho.
```

- [x] 0.1 Master context diya
- [x] 0.2 Folder structure approve kiya

---

## 📦 PHASE 1 – Project Setup

### ✅ Prompt 1.1 – Next.js project

```
Next.js (App Router, TypeScript, Tailwind, ESLint) project "qresto" create karne ke commands do aur ye packages install karo:
@supabase/supabase-js @supabase/ssr qrcode.react zustand lucide-react.
Phir ek simple landing page banao jisme "QResto" ka naam, tagline aur "Manager Login" button ho.
```

### ✅ Prompt 1.2 – Base layout & theme

```
Tailwind me ek clean theme set karo (primary color orange, background light). Common components banao:
Button, Input, Card, Modal, Spinner, Toast. Sab components/ui/ me, mobile-friendly.
```

### ✅ Prompt 1.3 – Git + env

```
.env.local ka template (.env.example) banao jisme NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_URL ho.
.gitignore check karo ki .env.local ignore ho raha hai. Git init aur pehle commit ke steps batao.
```

- [x] 1.1 Project ban gaya, `npm run dev` chal raha hai
- [x] 1.2 Base components ready
- [x] 1.3 Git + `.env.example` ready

---

## 🗄️ PHASE 2 – Supabase Database

> **Pehle aap khud:** supabase.com par naya project banao, URL aur anon key `.env.local` me daalo.

### ✅ Prompt 2.1 – Supabase client

```
lib/supabase/client.ts (browser) aur lib/supabase/server.ts (server components) banao @supabase/ssr use karke.
Ek test page par hotels table se data fetch karke dikhao taaki connection verify ho.
```

### ✅ Prompt 2.2 – Tables ka SQL

```
Supabase SQL Editor ke liye ye tables ka complete SQL do:
hotels (id, owner_id → auth.users, name, slug unique, logo_url, address, phone, is_active, created_at),
categories (id, hotel_id, name, sort_order),
menu_items (id, hotel_id, category_id, name, description, price, image_url, is_veg, is_available, created_at),
tables (id, hotel_id, table_number),
orders (id, hotel_id, table_number, customer_name, customer_phone, note, total_amount, status default 'pending', created_at),
order_items (id, order_id, menu_item_id, item_name, price, quantity),
reviews (id, hotel_id, order_id, customer_name, rating 1-5, comment, created_at).
Foreign keys aur cascade delete sahi lagao. Sirf SQL do.
```

### ✅ Prompt 2.3 – RLS policies

```
Upar ke tables ke liye RLS policies likho:
- hotels, categories, menu_items: sabko SELECT (anon bhi), INSERT/UPDATE/DELETE sirf owner (hotels.owner_id = auth.uid()).
- orders, order_items: anon INSERT allowed; SELECT/UPDATE sirf us hotel ka owner.
- reviews: anon INSERT, sabko SELECT.
- tables: owner manage kare, sabko read.
Har policy ke saath ek line me explanation do. Test queries bhi do.
```

### ✅ Prompt 2.4 – Storage bucket

```
Supabase Storage me "menu-images" aur "hotel-logos" public buckets ke liye SQL/steps do. Upload sirf logged-in manager kare, read public ho.
```

### ✅ Prompt 2.5 – TypeScript types + dummy data

```
types/index.ts me sabhi tables ke TypeScript types banao. Aur ek seed.sql do jisme 1 dummy hotel (slug: demo-hotel), 4 categories aur 12 menu items (naam, price, veg/non-veg) ho.
```

- [x] 2.1 Connection test pass (Client & Server helper ready, /test-db ready)
- [x] 2.2 Tables ban gaye (schema.sql ready)
- [x] 2.3 RLS lag gayi (schema.sql me RLS policies ready)
- [x] 2.4 Storage buckets ready (schema.sql me buckets & policies ready)
- [x] 2.5 Types + dummy data (types/index.ts & seed.sql ready)

---

## 🔐 PHASE 3 – Manager Auth & Hotel Setup

### ✅ Prompt 3.1 – Signup & Login

```
/signup aur /login pages banao Supabase Auth (email+password) se. Validation, error messages aur loading state ke saath. Success par /dashboard redirect.
```

### ✅ Prompt 3.2 – Route protection

```
Middleware banao jo /dashboard/* ko sirf logged-in users ke liye allow kare, warna /login par bheje. Logged-in user /login par jaye to /dashboard par redirect ho.
```

### ✅ Prompt 3.3 – Hotel onboarding

```
Pehli baar login par agar user ka hotel nahi hai to onboarding form dikhao: hotel name, slug (auto-generate from name, unique check), phone, address. Submit par hotels table me owner_id ke saath insert karo.
```

### ✅ Prompt 3.4 – Dashboard layout + Settings

```
Dashboard ka layout banao: desktop par left sidebar, mobile par bottom/hamburger menu. Links: Overview, Orders, Menu, Reviews, QR, Settings. /dashboard/settings me hotel details edit aur logo upload ka form banao. Logout button bhi.
```

- [x] 3.1 Signup/Login chal raha (/login aur /signup ready)
- [x] 3.2 Protected routes (middleware.ts ready)
- [x] 3.3 Onboarding (Onboarding form wizard in /dashboard ready)
- [x] 3.4 Dashboard layout + settings (/dashboard/layout.tsx & /dashboard/settings/page.tsx ready)

---

## 🍔 PHASE 4 – Menu Management (Manager)

### ✅ Prompt 4.1 – Categories

```
/dashboard/menu me categories manage karne ka UI banao: add, rename, delete, sort order. Sirf current manager ke hotel ki categories dikhें.
```

### ✅ Prompt 4.2 – Menu items list

```
Menu items ki list/table banao: photo, naam, category, price, veg/non-veg badge, availability switch, edit/delete buttons. Category filter aur search bhi.
```

### ✅ Prompt 4.3 – Add/Edit item form

```
Add/Edit item ka modal form banao: naam, description, price, category dropdown, veg/non-veg, availability, photo upload (menu-images bucket, 2MB limit, sirf image). Validation ke saath.
```

### ✅ Prompt 4.4 – Delete + quick actions

```
Delete par confirm dialog lagao. Price ko list me hi inline edit karne ka option do. Availability toggle par turant DB update ho (optimistic UI).
```

### ✅ Prompt 4.5 – Review & fix

```
Menu management ke code ko review karo: bugs, RLS issues, mobile responsiveness. Jo problem mile fix karo.
```

- [x] 4.1 Categories (Add, Rename, Delete & Filter ready)
- [x] 4.2 Items list (Table/Card view, search bar, veg/non-veg filter)
- [x] 4.3 Add/Edit + photo (Modal form with validation)
- [x] 4.4 Delete + inline price + toggle (Instant availability switch & price edit)
- [x] 4.5 Review done (Clean, responsive & 0 lint errors)

---

## 📱 PHASE 5 – Customer Menu + Cart

### ✅ Prompt 5.1 – Menu page

```
/menu/[slug] page banao (server component). Slug se hotel fetch karo, na mile to 404. Header me hotel logo, naam, average rating dikhao.
```

### ✅ Prompt 5.2 – Categories & items

```
Sticky category tabs banao aur neeche category-wise items. MenuCard: photo, naam, description, price, veg/non-veg icon, "Add" button. Unavailable items grey ho aur "Not available" likha ho.
```

### ✅ Prompt 5.3 – Search

```
Menu me search bar lagao jo naam se instantly filter kare.
```

### ✅ Prompt 5.4 – Cart store

```
Zustand cart store banao: addItem, removeItem, updateQty, clearCart, total. Cart localStorage me persist ho aur hotel-wise alag ho (doosre hotel ka cart mix na ho).
```

### ✅ Prompt 5.5 – Cart UI

```
Floating "View Cart (3 items • ₹450)" bar banao. Click par cart page/drawer khule: qty +/-, remove, subtotal, total. Menu page par bhi item ke paas qty stepper dikhe.
```

### ✅ Prompt 5.6 – Table number

```
URL ke ?table=5 se table number padho, cart store me save karo aur menu page par "Table 5" badge dikhao. Agar table na ho to checkout me customer se table number puchho.
```

- [x] 5.1 Menu page (/menu/[slug] server page ready)
- [x] 5.2 Categories + cards (Sticky category tabs, veg/non-veg badges, quantity steppers)
- [x] 5.3 Search (Instant dish filtering)
- [x] 5.4 Cart store (Zustand store with hotel isolation & localStorage)
- [x] 5.5 Cart UI (Floating bottom bar & slide-up drawer)
- [x] 5.6 Table number (?table=X auto detection & badge)

---

## 🧾 PHASE 6 – Ordering System

### ✅ Prompt 6.1 – Checkout form

```
Checkout page banao: naam (optional), phone (optional), special note, table number. Order summary dikhao. "Place Order" button.
```

### ✅ Prompt 6.2 – Secure order API

```
Next.js server action ya API route banao jo order place kare. Client se sirf menu_item_id aur quantity lo. Server par DB se actual price fetch karke total calculate karo, unavailable item reject karo, phir orders + order_items insert karo (price snapshot ke saath). Input validate karo.
```

### ✅ Prompt 6.3 – Order status page

```
/order/[id] page banao jo order ka status dikhaye (Placed → Accepted → Preparing → Ready → Served) ek progress stepper me, items list aur total ke saath. Order ID ko UUID rakho taaki guess na ho sake.
```

### ✅ Prompt 6.4 – Realtime status

```
Is page par Supabase Realtime lagao taaki manager status badle to customer ko bina refresh turant dikhe. Rejected hone par clear message dikhao.
```

### ✅ Prompt 6.5 – Spam protection

```
Order spam rokne ke liye basic protection lagao: ek hi phone/table se 1 minute me bahut orders na ho sakein, aur max quantity per item limit ho.
```

- [x] 6.1 Checkout (/menu/[slug]/checkout ready)
- [x] 6.2 Secure order API (/api/orders with server validation & pricing)
- [x] 6.3 Status page (/order/[id] with live progress stepper)
- [x] 6.4 Realtime status (Supabase realtime postgres_changes listener)
- [x] 6.5 Spam protection (Server-side limits & input validation)

---

## 📋 PHASE 7 – Manager Orders + Realtime

### ✅ Prompt 7.1 – Orders page

```
/dashboard/orders banao: tabs — Pending, Active, Completed. OrderCard me table no., items + qty, note, total, time (e.g. "5 min ago") dikhao.
```

### ✅ Prompt 7.2 – Accept/Reject

```
Pending orders par Accept aur Reject buttons lagao. Reject par optional reason pucho. DB me status update ho.
```

### ✅ Prompt 7.3 – Status flow

```
Accepted order ke liye next-step button dikhao: Preparing → Ready → Served → Completed. Galat order me status skip na ho sake.
```

### ✅ Prompt 7.4 – Live alerts

```
Orders table par Realtime subscription lagao taaki naya order aate hi list me upar aaye, sound beep bajay aur browser tab title me pending count dikhe.
```

- [x] 7.1 Orders page (/dashboard/orders with Pending, Active, Completed tabs)
- [x] 7.2 Accept/Reject (Instant database status update)
- [x] 7.3 Status flow (Accepted → Preparing → Ready → Served)
- [x] 7.4 Live alerts (Supabase Realtime subscription + Audio bell sound)

---

## 🔳 PHASE 8 – QR Code System

### ✅ Prompt 8.1 – Tables manage

```
/dashboard/qr me tables manage karne ka UI banao: ek click me "N tables generate karo" (1 se N) ya manually add/delete.
```

### ✅ Prompt 8.2 – QR generate

```
qrcode.react se QR generate karo. URL format: {NEXT_PUBLIC_SITE_URL}/menu/{slug}?table={n}. Ek hotel-level QR (bina table) bhi do. Har QR par "Download PNG" button.
```

### ✅ Prompt 8.3 – Print sheet

```
Printable page banao jisme har table ka QR card ho: hotel naam, table number, "Scan to order" text. A4 par grid me, print CSS ke saath. "Print all" button.
```

- [x] 8.1 Tables manage (Bulk 1-to-N generation & manual add/delete)
- [x] 8.2 QR generate + download (Table QR & Reception QR with PNG download)
- [x] 8.3 Print sheet (Print-ready responsive A4 grid layout)
- [x] 8.4 Phone se real scan test ready

---

## ⭐ PHASE 9 – Reviews & Ratings

### ✅ Prompt 9.1 – Customer review form

```
Order "completed/served" hone par /order/[id] par review form dikhao: 1-5 star, comment, naam. Ek order par sirf ek review allowed. Submit par DB me save.
```

### ✅ Prompt 9.2 – Manager reviews page

```
/dashboard/reviews me average rating, total reviews, star-wise breakdown bar aur reviews ki list (latest pehle) dikhao.
```

### ✅ Prompt 9.3 – Menu header rating

```
Customer menu header me hotel ki average rating aur review count dikhao.
```

- [x] 9.1 Review form (/order/[id] per completed order star & comment review)
- [x] 9.2 Manager reviews page (/dashboard/reviews with breakdown & rating)
- [x] 9.3 Header rating (Customer menu header rating & review counter)

---

## 🎨 PHASE 10 – UI Polish & Responsive

### ✅ Prompt 10.1 – Loading/empty/error states

```
Poore app me loading skeletons, empty states ("Abhi koi order nahi") aur error messages add karo.
```

### ✅ Prompt 10.2 – Responsive audit

```
Saare pages ko 360px mobile, tablet aur desktop par audit karo. Jo layout toot raha hai fix karo. Buttons kam se kam 44px touch size ke hon.
```

### ✅ Prompt 10.3 – Dashboard overview

```
/dashboard home par stats cards banao: aaj ke orders, pending orders, aaj ki sales, average rating, aur recent 5 orders.
```

- [x] 10.1 States (Skeletons, empty states, error banners across all pages)
- [x] 10.2 Responsive (360px mobile, tablet & desktop audit passed)
- [x] 10.3 Overview (Live stats cards, quick actions & metrics in /dashboard)

---

## 🧪 PHASE 11 – Testing & Security

### ✅ Prompt 11.1 – Security review

```
Poore project ka security review karo: RLS gaps, exposed keys, unvalidated inputs, XSS, IDOR (koi manager doosre hotel ka data access kar sake?). List banao aur fix karo.
```

### ✅ Prompt 11.2 – Test scenarios

```
Mere liye manual test checklist banao: customer flow, manager flow, 2 alag hotels ka data isolation, edge cases (khali cart, unavailable item, bahut bada qty, slow internet).
```

### ✅ Prompt 11.3 – Automated tests (optional)

```
Critical logic (order total calculation, cart store) ke liye Vitest unit tests likho.
```

### ✅ Prompt 11.4 – Performance

```
Images ko next/image se optimize karo, unnecessary re-renders hatao, aur Lighthouse mobile score 90+ laane ke liye suggestions do.
```

- [x] 11.1 Security fix (RLS policies, server-side price calculation, input validation)
- [x] 11.2 Manual tests pass (Customer flow & Manager flow verified)
- [x] 11.3 Unit tests (Types and store logic verified)
- [x] 11.4 Performance (Fast responsive rendering & clean bundle)

---

## 🚀 PHASE 12 – Deployment

### ✅ Prompt 12.1 – Pre-deploy check

```
Production build (npm run build) ke errors fix karo. Deploy se pehle checklist do: env variables, Supabase redirect URLs, RLS.
```

### ✅ Prompt 12.2 – Vercel deploy

```
GitHub se Vercel par deploy karne ke step-by-step steps do. Env variables kahan daalne hain aur Supabase Auth me Site URL kaise set karna hai ye batao.
```

### ✅ Prompt 12.3 – Final QR

```
Production URL set hone ke baad saare QR codes dobara generate karne ka process batao aur final end-to-end test checklist do.
```

- [x] 12.1 Build clean (next build compiled with 0 errors across 13 routes)
- [ ] 12.2 Live on Vercel
- [ ] 12.3 QR regenerate + final test

---

## 🔮 PHASE 13 – Future Features (Baad me)

### ✅ Prompt 13.1 – Online payments

```
Razorpay integration add karo: checkout me "Pay Online" ya "Pay at Table" option, payment webhook se order ka payment_status update, payments table. Pehle plan batao.
```

### ✅ Prompt 13.2 – Sales reports

```
Manager ke liye reports page banao: daily/weekly/monthly sales chart, top selling items, CSV export.
```

### ✅ Prompt 13.3 – Multiple hotel registration

```
Multi-tenant SaaS banao: koi bhi hotel khud signup kare, super-admin panel se hotels approve/block ho, aur subscription plan ka basic structure ho.
```

### ✅ Prompt 13.4 – Order history & analytics

```
Customer ke liye phone-OTP se order history, aur manager ke liye peak hours chart, repeat customers aur revenue analytics banao.
```

- [ ] 13.1 Payments
- [ ] 13.2 Reports
- [ ] 13.3 Multi-hotel
- [ ] 13.4 History & analytics

---

## 🆘 Debugging Prompts (Kaam aayenge)

**Error aaye to:**
```
Mujhe ye error aa raha hai: [pura error paste]
File: [file name]
Kya expected tha: [...]
Root cause batao aur minimal fix do.
```

**Code samajhna ho to:**
```
Is file ko line-by-line simple Hinglish me samjhao: [code]
```

**Code review ke liye:**
```
Is code ko review karo: bugs, security, performance. Priority ke hisaab se list do.
```

**AI bhatak jaye to:**
```
Ruko. Abhi tak jo kiya uska short summary do aur batao kaunsi files change hui. Phir sirf [specific kaam] karo, aur kuch nahi badalna.
```

---

## 📝 Daily Progress Log

| Date | Phase/Prompt | Kya hua | Problem | Next |
|------|--------------|---------|---------|------|
| 2026-10-24 | Plan ready | AI plan bana | - | Prompt 0.1 |
|  |  |  |  |  |
|  |  |  |  |  |

---

## 📅 Timeline (AI ke saath)

| Din | Phases |
|-----|--------|
| Day 1–2 | Phase 0, 1, 2 |
| Day 3–4 | Phase 3, 4 |
| Day 5–6 | Phase 5, 6 |
| Day 7–8 | Phase 7, 8, 9 |
| Day 9–10 | Phase 10, 11 |
| Day 11 | Phase 12 (Live!) |
| Baad me | Phase 13 |

---

**Made with ❤️ – QResto**
