# MeraResto — Master Environment Variables Specification
**Platform:** MeraResto Multi-Restaurant SaaS  
**Version:** 1.0.0  

---

## 1. Environment Variable Security Matrix

> [!CAUTION]
> **Zero Exposure Rule:** Secret keys (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`) must **NEVER** be prefixed with `NEXT_PUBLIC_` and must **NEVER** be committed to Git or referenced in client-side code (`"use client"`).

| Variable Name | Classification | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | All Apps | Supabase Project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | All Apps | Supabase Anonymous Client Key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | `dashboard`, `super-admin` | Bypasses RLS for admin actions |
| `NEXT_PUBLIC_SITE_URL` | Public | All Apps | Root URL for the specific application |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Public | All Apps | Primary domain (`meraresto.in` or `localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Public | All Apps | URL of Dashboard (`https://app.meraresto.in`) |
| `NEXT_PUBLIC_MENU_URL` | Public | All Apps | URL of Customer Menu (`https://menu.meraresto.in`) |
| `NEXT_PUBLIC_KITCHEN_URL` | Public | All Apps | URL of Kitchen Display (`https://kitchen.meraresto.in`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public | `dashboard`, `customer-menu` | Razorpay Gateway Public Key |
| `RAZORPAY_KEY_SECRET` | **Secret** | `dashboard`, `super-admin` | Razorpay Webhook & Payment Secret |

---

## 2. Per-Application Variable Requirements

### A. `apps/website` (`meraresto.in`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://trnctyojyjpotgrcjahj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-kU6jsR6mKK_HACARilvbQ_jVRjTpJZ
NEXT_PUBLIC_SITE_URL=https://meraresto.in
NEXT_PUBLIC_ROOT_DOMAIN=meraresto.in
NEXT_PUBLIC_APP_URL=https://app.meraresto.in
NEXT_PUBLIC_MENU_URL=https://menu.meraresto.in
```

### B. `apps/dashboard` (`app.meraresto.in`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://trnctyojyjpotgrcjahj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-kU6jsR6mKK_HACARilvbQ_jVRjTpJZ
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_SITE_URL=https://app.meraresto.in
NEXT_PUBLIC_ROOT_DOMAIN=meraresto.in
NEXT_PUBLIC_MENU_URL=https://menu.meraresto.in
NEXT_PUBLIC_KITCHEN_URL=https://kitchen.meraresto.in
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### C. `apps/customer-menu` (`menu.meraresto.in`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://trnctyojyjpotgrcjahj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-kU6jsR6mKK_HACARilvbQ_jVRjTpJZ
NEXT_PUBLIC_SITE_URL=https://menu.meraresto.in
NEXT_PUBLIC_ROOT_DOMAIN=meraresto.in
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
```

### D. `apps/kitchen` (`kitchen.meraresto.in`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://trnctyojyjpotgrcjahj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-kU6jsR6mKK_HACARilvbQ_jVRjTpJZ
NEXT_PUBLIC_SITE_URL=https://kitchen.meraresto.in
NEXT_PUBLIC_ROOT_DOMAIN=meraresto.in
NEXT_PUBLIC_APP_URL=https://app.meraresto.in
```

### E. `apps/super-admin` (`admin.meraresto.in`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://trnctyojyjpotgrcjahj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-kU6jsR6mKK_HACARilvbQ_jVRjTpJZ
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_SITE_URL=https://admin.meraresto.in
NEXT_PUBLIC_ROOT_DOMAIN=meraresto.in
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

---

## 3. Local Development Template (`.env.local`)

```env
# Local Development Environment (Turborepo)
NEXT_PUBLIC_SUPABASE_URL=https://trnctyojyjpotgrcjahj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-kU6jsR6mKK_HACARilvbQ_jVRjTpJZ
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_MENU_URL=http://localhost:3002
NEXT_PUBLIC_KITCHEN_URL=http://localhost:3003
NEXT_PUBLIC_ADMIN_URL=http://localhost:3004
```

---
*End of Master Environment Variables Specification.*

