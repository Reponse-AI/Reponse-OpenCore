---
title: "Reponse metafields and block in Shopify Admin"
description: "See each customer's loyalty, tickets, reviews and referrals directly in your Shopify admin."
---

## Overview

Once the Reponse app is installed from the App Store, every customer page in your Shopify admin shows what Reponse knows about that customer: their points balance and loyalty tier, their open tickets, their reviews and their referral activity. The data arrives in two forms:

- **Metafields and tags** on the Shopify customer, which you can use in segments and in Shopify Flow.
- **A Reponse block** rendered by Shopify on the customer page, below the native cards, with links to the Reponse dashboard.

There is nothing to build or configure on the theme side. Everything is included in the free plan, like the rest of the suite.

## What appears in Shopify

### The nine metafields

Metafields are written in the namespace reserved for the app. In the admin it appears as `app--{app-id}--reponse`, where `{app-id}` is the numeric identifier Shopify assigned to the Reponse app. Only the app can write to it; you can read, filter and display these fields, but not edit them by hand.

| Key | Type | Meaning |
|---|---|---|
| `loyalty_points` | Integer | Current loyalty points balance |
| `loyalty_tier` | Text | Name of the current loyalty tier (for example "Gold") |
| `reviews_count` | Integer | Number of published reviews written by this customer |
| `reviews_avg_rating` | Decimal | Average rating across their published reviews |
| `open_tickets` | Integer | Support tickets currently open or awaiting the customer's reply |
| `last_ticket_at` | Date and time | When their most recent ticket was created |
| `referrals_count` | Integer | Referred customers who placed an order thanks to this customer |
| `referral_code` | Text | Their referral code |
| `contact_url` | URL | Link to their profile in the Reponse dashboard |

The first eight use types that Shopify segmentation can filter on (number, text, date). `contact_url` is a link: it is not meant for segments, by design.

An empty field is never overwritten with a null value. If a customer has no points, no ticket and no review, their metafields simply stay absent from the page rather than showing zeros.

### The two tags

For merchants who segment by tag rather than by metafield, Reponse also sets two tags on the customer:

- `reponse:tier:{tier}`, for example `reponse:tier:gold`. Only one tier tag at a time: when the customer moves to another tier, the old tag is removed.
- `reponse:ticket-open`, present as long as at least one ticket is open, removed once everything is resolved.

Your other tags are never touched. Reponse only adds and removes tags that start with `reponse:`.

### The Reponse block on the customer page

Below the native cards of the customer page, Shopify displays a Reponse block with four sections, in this order:

1. **Loyalty**: points balance and tier.
2. **Tickets**: open tickets with their status.
3. **Reviews**: average rating and latest published reviews.
4. **Referrals**: referral code and number of converted referrals.

Each section offers a link that opens the matching page in the Reponse dashboard, in a new tab. The block is translated in English and French according to the language of the staff member signed in to the admin.

When Reponse does not know this customer yet (no conversation, no ticket, no review), the block simply says so. If a network error occurs, a "Retry" button is offered.

## Connecting your store

### 1. Install the app

Install the Reponse app from the App Store: [apps.shopify.com/reponse](https://apps.shopify.com/reponse). Shopify asks you to accept the permissions listed below, then opens the app inside your admin.

### 2. Create an API key in Reponse

In the Reponse dashboard, open [Settings › API keys](app:dashboard_settings) and create a key of type **Reponse** with at least these three scopes:

| Scope | Purpose |
|---|---|
| `read:customers` | Find the Reponse contact that matches the Shopify customer |
| `read:conversations` | Feed the block on the customer page |
| `write:integrations` | Record the link between your store and your workspace |

A key created from Settings › API keys carries full access, so it covers all three without any extra configuration.

Copy the key when it is created: it is shown only once.

### 3. Paste the key into the app

In the Reponse app opened from your Shopify admin, paste the key into the settings and save. The app then sends your store domain to Reponse, which shows the store as connected in [Settings › Integrations](app:dashboard_integrations). No token needs to be typed in.

If the key is later revoked, the app flags it and asks you to enter a new one.

### Shopify permissions requested

At install time, Shopify shows you the app's list of permissions. Here is why each one is requested:

| Permission | Purpose |
|---|---|
| `read_customers`, `write_customers` | Read customers to link them to their Reponse contacts, and write the metafields and tags described above |
| `read_orders`, `write_orders` | Track orders on the customer page and create an order from a conversation |
| `read_fulfillments` | Shipment tracking: carrier, tracking number and link, to answer the customer |
| `read_products`, `read_inventory` | Sync the catalog and check availability before suggesting a product |
| `read_discounts` | Display discount codes by their name |
| `read_shipping`, `read_markets`, `read_locales`, `read_translations` | Shipping profiles, markets, languages and translations, to answer in the right language with the right rates |
| `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts` | Storefront token created for the headless checkout: read the published catalog, create and read back a checkout from the site or the chat |

One list, accepted once. If a future version of the app requests an additional permission, Shopify will ask you to accept it again.

## Using the data in your segments

In **Customers › Segments**, the Reponse metafields are offered in the filter editor under the app's name. A few examples:

```text
metafields.app--{app-id}--reponse.open_tickets > 0
```

Every customer with a ticket in progress, for instance to exclude them from a promotional campaign.

```text
metafields.app--{app-id}--reponse.loyalty_points >= 500 AND metafields.app--{app-id}--reponse.reviews_count = 0
```

Loyal customers who have never left a review.

```text
customer_tags CONTAINS 'reponse:tier:gold'
```

The same thing by tag, for segments already built on tags. Replace `{app-id}` with the identifier Shopify shows in the segment editor: it is offered by autocomplete, you do not need to know it by heart.

These segments also work as triggers in Shopify Flow and as audiences in Shopify Email.

## Refresh delay

Reponse does not rewrite the customer page on every event. When something changes for a contact (points credited, ticket opened or resolved, review published, referral converted), the contact is queued, and the queue is processed roughly every five minutes. Expect **up to five minutes** between an action in Reponse and its visibility in Shopify.

Values are computed at write time, never ahead of it: an old update cannot overwrite a more recent value. If nothing has changed since the last write, the page is left untouched.

When the store is connected, Reponse fills in the pages of customers it already knows (customers active in the last 90 days for a free workspace, all customers for a paid workspace). On a large customer base, this initial fill takes several hours: it progresses in batches of 200 customers every five minutes, within Shopify's API limits.

## The "authorization needs renewing" state

Sometimes Shopify refuses a write: the app was reinstalled, a new version requests permissions you have not accepted yet, or access was revoked from the admin. In that case Reponse immediately stops writing to your store, shows an **Authorization needs renewing** banner in [Settings › Integrations](app:dashboard_integrations) and sends you a notification. The block on the customer page shows the same state.

To fix it: open the Reponse app once in your Shopify admin and accept the requested permissions. Shopify then issues a new authorization to Reponse, writing resumes on its own and the pending contacts are processed on the next pass. Nothing is lost in the meantime.

## Uninstalling

If you uninstall the app from your Shopify admin:

- Reponse is notified and stops writing to your store right away. The authorization and the related settings are cleared on the Reponse side.
- Metafields and tags already set **stay on your customers**: Shopify does not delete them, and Reponse no longer touches them. Your segments that use them keep working with the last known values.
- The Reponse block disappears from the customer page.
- Your contacts, conversations, tickets and reviews in Reponse are not affected.

If you want the metafields removed from your customers (which also empties the segments built on them), write to us: we never do it without your explicit consent.

## Limits

- **One store per workspace.** A Reponse workspace can be linked to a single Shopify store. If you try to link a second store, Reponse refuses with a clear message instead of replacing the first one.
- **Custom App token.** Stores connected by pasting a Custom App token by hand (the former method) keep working for catalog and order reads and for migration. They get no metafields, no tags and no block until the Reponse app is installed from the App Store: these features rely on the namespace reserved for the app, which a Custom App token cannot access. Settings › Integrations points this out and offers the install.
- **Customers without an email.** A Shopify customer is matched to a Reponse contact by Shopify ID, then by email. A Shopify customer with no email address and no history in Reponse has nothing to display.
- **Read-only in Shopify.** The metafields are read-only in the admin. To credit points or open a ticket, use the Reponse dashboard.

## Privacy

Reponse only exports **derived counts and states** to Shopify: a points balance, a tier name, a review count and an average rating, a ticket count and a date, a referral count, a referral code and a link. No conversation, ticket or review content leaves Reponse to be stored in Shopify.

The block on the customer page shows more (ticket statuses, latest reviews), but that information is read on demand when a member of your team opens the page, with their Shopify access rights, and is not stored in Shopify.

In the other direction, Reponse uses the Shopify customer's ID and email to link them to their contact. Customer data deletion and export requests issued by Shopify are honored automatically: the contact's data is anonymized in Reponse.
