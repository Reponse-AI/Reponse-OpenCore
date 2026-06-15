---
title: "Custom Domains"
description: "Serve your storefront and pages on a custom domain."
---

## Overview

Every Reponse workspace can connect a **custom domain** so that conversation pages, product pages, and your storefront are served under your own brand (e.g. `shop.example.com` instead of `example.reponse.ai`). Domain management is handled through Netlify DNS with automatic SSL provisioning via Let's Encrypt.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace with **owner** or **admin** role |
| Domain registrar access | Ability to create CNAME or A records |
| Custom domain | A domain or subdomain you own (e.g. `shop.example.com`) |

## Step 1 — Add the domain in the dashboard

1. Open **Dashboard → Settings → Custom Domain**.
2. Enter your domain (e.g. `shop.example.com`).
3. Click **Add Domain**.

Reponse validates the format, checks that the domain is not already used by another workspace, registers it with Netlify, and sets the status to **pending**.

## Step 2 — Configure DNS

After adding the domain, the dashboard displays DNS instructions. Create the following record at your domain registrar:

### For subdomains (recommended)

| Type | Name | Value | TTL |
|---|---|---|---|
| `CNAME` | `shop` | `reponseai.netlify.app` | 3600 |

### For apex domains

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `75.2.60.5` | 3600 |

> **Note:** Netlify's load-balancer IP may change. Always refer to the instructions shown in your dashboard for the current value.

## Step 3 — Verify the domain

1. Return to **Dashboard → Settings → Custom Domain**.
2. Click **Check Status**.
3. Reponse queries Netlify to confirm DNS propagation.

DNS propagation typically takes 5–30 minutes but can take up to 48 hours depending on your registrar.

| Status | Meaning |
|---|---|
| `pending` | DNS not yet verified — traffic stays on `reponse.ai` |
| `verified` | DNS confirmed — SSL provisioned, domain is live |

## Step 4 — SSL provisioning

SSL is provisioned **automatically** once DNS is verified. Reponse calls Netlify's SSL API to provision a free Let's Encrypt certificate. If provisioning does not trigger automatically, click **Force SSL** in the dashboard.

```typescript
// Internal server action (for reference)
await forceProvisionSsl(workspaceId);
```

## Domain lifecycle

```
Add domain → pending → DNS verified → SSL provisioned → verified (live)
                                                          ↓
                                               Remove domain → cleared
```

## SEO impact

Once a domain is verified:

- **Canonical URLs** point to your custom domain instead of `reponse.ai`.
- **Hreflang tags** reference your domain for each locale.
- **Sitemap** entries use your domain for all product and page URLs.
- **Open Graph / Twitter meta** reflect your branded domain.

## Configuration reference

| Setting | Location | Description |
|---|---|---|
| Custom domain | Dashboard → Settings → Custom Domain | The domain or subdomain to connect |
| Verification status | Dashboard → Settings → Custom Domain | `pending` or `verified` |
| Force SSL | Dashboard → Settings → Custom Domain | Manually trigger SSL provisioning |
| Remove domain | Dashboard → Settings → Custom Domain | Disconnect and clear DNS records |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Status stays `pending` | DNS not propagated yet | Wait up to 48h, then re-check |
| "Domain already configured" error | Another workspace uses this domain | Remove it from the other workspace first |
| SSL certificate not issued | DNS not yet pointing to Netlify | Verify CNAME/A record, then click **Force SSL** |
| Mixed content warnings | Some assets still on `reponse.ai` | Clear CDN cache and redeploy |
| "Only owners/admins can configure" | Insufficient role | Ask a workspace owner to add the domain |
