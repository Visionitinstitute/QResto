# MeraResto — Multi-Project Vercel Deployment & DevOps Architecture
**Platform:** Vercel  
**Monorepo Engine:** Turborepo  
**GitHub Repository:** `https://github.com/Visionitinstitute/meraresto.git`  
**Version:** 1.0.0  

---

## 1. Vercel Multi-Project Architecture Overview

Rather than deploying one monolithic project, MeraResto deploys **five independent Vercel projects** linked to the same monorepo repository (`meraresto.git`). This guarantees:
1. **Isolated Build Lifecycles:** A change in the marketing website does not trigger rebuilds or deployments for the mission-critical Kitchen Display System.
2. **Independent Scaling & Caching:** Dedicated serverless function concurrency and edge caching for customer menus separate from heavy manager dashboard queries.
3. **Dedicated Subdomain Routing:** Native mapping of each Vercel project to its specific subdomain without complex, fragile reverse-proxy rewrites.

---

## 2. Project Mapping Matrix

| Vercel Project Name | Application Subdomain | Monorepo Root Directory | Build Command | Output Directory |
| :--- | :--- | :--- | :--- | :--- |
| `meraresto-website` | `meraresto.in` | `apps/website` | `npx turbo run build --filter=website` | `.next` |
| `meraresto-dashboard` | `app.meraresto.in` | `apps/dashboard` | `npx turbo run build --filter=dashboard` | `.next` |
| `meraresto-customer-menu` | `menu.meraresto.in` | `apps/customer-menu` | `npx turbo run build --filter=customer-menu` | `.next` |
| `meraresto-kitchen` | `kitchen.meraresto.in` | `apps/kitchen` | `npx turbo run build --filter=kitchen` | `.next` |
| `meraresto-super-admin` | `admin.meraresto.in` | `apps/super-admin` | `npx turbo run build --filter=super-admin` | `.next` |

---

## 3. Step-by-Step Vercel Setup Instructions

### Step 1: Create the 5 Projects in Vercel Dashboard
For each application:
1. Open [Vercel Dashboard](https://vercel.com/dashboard) → **Add New...** → **Project**.
2. Select repository: `Visionitinstitute/meraresto`.
3. In **Project Name**, enter the name from the table above (e.g. `meraresto-dashboard`).
4. **CRITICAL STEP:** Click **Edit** next to **Root Directory**, and select the corresponding folder (e.g. `apps/dashboard`).
5. Ensure **Include source files outside of the Root Directory in the Build Step** is **CHECKED** (required for monorepo workspace dependencies).
6. Under **Build and Output Settings**, leave Framework Preset as **Next.js**.

---

### Step 2: Configure Monorepo Build Commands & Caching
In each project's **Settings → General → Build & Development Settings**:
- **Build Command:** `npx turbo run build --filter=<app-name>`
- **Install Command:** `npm install` (or `pnpm install`)
- **Turborepo Remote Caching:** Vercel automatically configures `TURBO_TOKEN` and `TURBO_TEAM` to cache build artifacts across commits.

---

### Step 3: Configure Environment Variables
Navigate to **Settings → Environment Variables** for each project and configure the variables detailed in [`docs/ENVIRONMENT_VARIABLES.md`](file:///c:/Users/USER/Desktop/Bal%20kumari/qresto/docs/ENVIRONMENT_VARIABLES.md).

---

### Step 4: Configure Custom Subdomains & SSL
Under **Settings → Domains** for each respective project:
1. `meraresto-website`: Add `meraresto.in` and `www.meraresto.in`
2. `meraresto-dashboard`: Add `app.meraresto.in`
3. `meraresto-customer-menu`: Add `menu.meraresto.in`
4. `meraresto-kitchen`: Add `kitchen.meraresto.in`
5. `meraresto-super-admin`: Add `admin.meraresto.in`

---

## 4. Zero-Downtime Migration Protection
- The legacy single-app Vercel deployment (`qresto`) remains untouched and active until all 5 new projects complete successful preview builds and pass verification tests.
- DNS records will only be switched after SSL verification completes on Vercel.

---
*End of Vercel Deployment Specification.*
