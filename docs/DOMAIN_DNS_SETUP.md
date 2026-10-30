# MeraResto — Domain, DNS Configuration & SSL Setup Guide
**Root Domain:** `meraresto.in`  
**DNS Provider:** Cloudflare / GoDaddy / Namecheap / Hostinger  
**Hosting Infrastructure:** Vercel Edge Network  
**Version:** 1.0.0  

---

## 1. Subdomain Topology & Destination Table

| Subdomain | Full Qualified Domain Name (FQDN) | Target Vercel Project | Primary Function |
| :--- | :--- | :--- | :--- |
| **Apex / Root** | `meraresto.in` | `meraresto-website` | Marketing Website |
| **WWW** | `www.meraresto.in` | `meraresto-website` | Redirect to Apex |
| **Dashboard** | `app.meraresto.in` | `meraresto-dashboard` | Restaurant Management Portal |
| **Customer Menu** | `menu.meraresto.in` | `meraresto-customer-menu` | Mobile Digital QR Menu |
| **Kitchen KDS** | `kitchen.meraresto.in` | `meraresto-kitchen` | Kitchen Display System |
| **Super Admin** | `admin.meraresto.in` | `meraresto-super-admin` | Platform Administration |

---

## 2. Complete DNS Record Specification

Configure the following records in your DNS Management Console (Cloudflare, Namecheap, GoDaddy, etc.):

| Type | Name / Host | Target / Value | TTL | Proxy Status (Cloudflare) |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Auto (or 300s) | DNS Only (Gray Cloud during verification) |
| **CNAME** | `www` | `cname.vercel-dns.com` | Auto (or 300s) | DNS Only |
| **CNAME** | `app` | `cname.vercel-dns.com` | Auto (or 300s) | DNS Only |
| **CNAME** | `menu` | `cname.vercel-dns.com` | Auto (or 300s) | DNS Only |
| **CNAME** | `kitchen` | `cname.vercel-dns.com` | Auto (or 300s) | DNS Only |
| **CNAME** | `admin` | `cname.vercel-dns.com` | Auto (or 300s) | DNS Only |

> [!IMPORTANT]
> If using **Cloudflare**, ensure the **Proxy Status is set to "DNS Only" (Gray Cloud)** during initial domain verification on Vercel. Once Vercel issues the Let's Encrypt SSL certificate, Cloudflare proxying (Orange Cloud) can be re-enabled if full SSL/TLS encryption is set to **"Full (Strict)"**.

---

## 3. SSL / TLS Verification Workflow
1. When you add a domain or subdomain in the Vercel Dashboard, Vercel initiates an automated challenge to verify ownership.
2. Vercel automatically requests, provisions, and renews wild-card / individual **Let's Encrypt SSL Certificates** for every configured subdomain.
3. Automated renewal occurs 30 days prior to expiration with zero administrative overhead.

---

## 4. Cross-Subdomain Auth Cookie Configuration

To ensure a restaurant owner can seamlessly transition between `app.meraresto.in` and `kitchen.meraresto.in` without re-authenticating:
- In Supabase Auth and `@meraresto/auth`, cookies must be configured with a **leading dot**:
  ```ts
  cookieOptions: {
    domain: '.meraresto.in',
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }
  ```
- **Local Development Exception:** When developing locally (`localhost:3000`, `localhost:3001`), omit the `domain` property to allow localhost cookie sharing.

---

## 5. DNS Verification & Diagnostics Checklist

```bash
# Verify Apex A record resolution
dig +short A meraresto.in

# Verify Subdomain CNAME resolution
dig +short CNAME app.meraresto.in
dig +short CNAME menu.meraresto.in
dig +short CNAME kitchen.meraresto.in
dig +short CNAME admin.meraresto.in

# Verify SSL Certificate handshake
curl -Iv https://app.meraresto.in
```

---
*End of Domain & DNS Setup Guide.*
