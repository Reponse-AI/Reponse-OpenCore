---
title: "Klaviyo Integration"
description: "Connect Klaviyo for email and SMS flows."
---

## Overview

Reponse integrates with **Klaviyo** so you can power marketing flows — abandoned cart, post-purchase, win-back, and more — directly from commerce events captured by the Reponse chat agent. Once connected, leads and events are forwarded to your Klaviyo lists automatically.

## Prerequisites

| Requirement | Description |
|---|---|
| Klaviyo account | Free or paid plan |
| Klaviyo Private API key | Created in **Klaviyo → Settings → API Keys** with `Lists` and `Profiles` scopes |
| Reponse workspace | Active workspace with owner or admin role |

## Step 1 — Generate a Klaviyo API key

1. Log in to [Klaviyo](https://www.klaviyo.com/).
2. Navigate to **Settings → API Keys → Create Private API Key**.
3. Grant the following scopes: **Lists (Read/Write)**, **Profiles (Read/Write)**, **Events (Write)**.
4. Copy the key — it starts with `pk_`.

## Step 2 — Connect Klaviyo in the dashboard

1. Open your Reponse dashboard → **Settings → Integrations → Klaviyo**.
2. Paste your Private API key.
3. Click **Connect**. Reponse encrypts and stores the key securely.

Once connected, the integration card shows a green **Connected** badge.

## Step 3 — Select a subscriber list

After connecting, Reponse fetches your Klaviyo lists automatically:

```typescript
// Server action used internally
const result = await getKlaviyoLists(workspaceId);
// result.data → [{ id, attributes: { name, created, updated } }, ...]
```

In the dashboard, pick the list where captured leads should be subscribed. Every lead email collected by the chat agent is added to this list.

## Step 4 — Event tracking

Reponse forwards the following events to Klaviyo:

| Event name | Trigger | Payload |
|---|---|---|
| `Lead Captured` | Email collected via chat | `email`, `conversationId`, `productName` |
| `Product Viewed` | Chat opened on a product page | `productId`, `productName`, `price` |
| `Chat Completed` | Conversation ended by user | `messageCount`, `duration`, `leadEmail` |
| `Checkout Started` | Shopper initiated checkout | `cartTotal`, `itemCount`, `currency` |

Events appear in Klaviyo under **Analytics → Metrics** and can be used as flow triggers.

## Configuration reference

| Setting | Location | Description |
|---|---|---|
| API key | Dashboard → Integrations | Klaviyo private API key (`pk_*`) |
| Subscriber list | Dashboard → Integrations | Target list for lead subscription |
| Auto-subscribe | Dashboard → Integrations | Toggle automatic subscription on lead capture |
| Event forwarding | Dashboard → Integrations | Enable/disable event forwarding |

## Using the server actions

The Klaviyo integration exposes two main server actions you can use in custom server components:

```typescript
import { getKlaviyoApiKey } from '@/lib/klaviyo.actions';
import { getKlaviyoLists } from '@/lib/klaviyo.actions';

// Retrieve the decrypted API key for a workspace
const apiKey = await getKlaviyoApiKey(workspaceId);

// Fetch all lists with optional filters
const lists = await getKlaviyoLists(workspaceId, {
  fieldsList: ['name', 'created'],
  sort: '-created',
});
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "API key not found" error | Key not saved or deleted in Klaviyo | Re-enter the key in Dashboard → Integrations |
| Lists not loading | Key missing `Lists` scope | Regenerate the key with correct scopes in Klaviyo |
| Leads not appearing in Klaviyo | Wrong list selected or auto-subscribe off | Check list selection and toggle in dashboard |
| Events missing in Klaviyo Metrics | Event forwarding disabled | Enable it in Dashboard → Integrations |
| 401 / 403 from Klaviyo API | Expired or revoked key | Generate a new key and reconnect |
