---
title: "Loyalty Program"
description: "How the Reponse loyalty program works."
---

## Overview

The Reponse loyalty program lets contacts **earn points** on purchases and actions, **progress through tiers** for increasing benefits, and **refer friends** for bonus rewards. Points balances, tier status, and redemption history are fully accessible through the API and SDK.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace on a plan that includes loyalty |
| API key | Key with `loyalty:read`, `loyalty:write` scopes |
| Products | At least one product to trigger purchase-based earning |

## Step 1 — Enable the loyalty program

1. Open **Dashboard → Loyalty → Settings**.
2. Toggle **Enable Loyalty Program**.
3. Set the program name (e.g. "Rewards Club") and point currency name (e.g. "Stars").

## Step 2 — Configure earn rules

Earn rules define how contacts accumulate points:

| Rule type | Example | Configuration |
|---|---|---|
| **Purchase** | 1 point per €1 spent | Set `points_per_currency_unit` |
| **Sign-up** | 100 points on first registration | Set `signup_bonus` |
| **Review** | 50 points per product review | Set `review_bonus` |
| **Birthday** | 200 points on birthday | Set `birthday_bonus` |
| **Custom event** | Variable points on any tracked event | Define via API |

Configure earn rules in **Dashboard → Loyalty → Earn Rules**, or via the API:

```typescript
await reponse.loyalty.createEarnRule({
  body: {
    type: 'purchase',
    pointsPerUnit: 1,
    currency: 'EUR',
    description: '1 Star per €1 spent',
  },
});
```

## Step 3 — Set up tiers

Tiers reward your most loyal customers with escalating benefits:

| Tier | Lifetime points | Benefits |
|---|---|---|
| **Bronze** | 0 – 499 | Base earn rate, birthday bonus |
| **Silver** | 500 – 1 999 | 1.5× earn multiplier, early access |
| **Gold** | 2 000 – 4 999 | 2× earn multiplier, free shipping |
| **Platinum** | 5 000+ | 3× earn multiplier, exclusive products, priority support |

Configure tiers in **Dashboard → Loyalty → Tiers**. Each tier specifies:

- **Threshold** — minimum lifetime points to qualify
- **Earn multiplier** — multiplied against the base earn rate
- **Benefits** — free-text description shown to the contact

## Step 4 — Redemption

Contacts redeem points for discounts at checkout:

```typescript
// Check balance
const { data: balance } = await reponse.loyalty.getBalance({
  path: { contactId: 'ctc_xxx' },
});
// balance → { available: 1250, lifetime: 3400, tier: "Gold" }

// Redeem points for a discount
const { data: redemption } = await reponse.loyalty.redeem({
  path: { contactId: 'ctc_xxx' },
  body: {
    points: 500,
    reason: 'checkout',
    orderId: 'ord_xxx',
  },
});
// redemption → { discountAmount: 5.00, currency: "EUR", remainingPoints: 750 }
```

### Redemption rules

| Setting | Description | Default |
|---|---|---|
| `min_redeem_points` | Minimum points per redemption | 100 |
| `points_to_currency_ratio` | Points per 1 unit of currency | 100:1 |
| `max_redeem_per_order` | Max discount percentage per order | 50% |

## Step 5 — Referral program

Drive growth by letting contacts refer friends:

1. Enable referrals in **Dashboard → Loyalty → Referral**.
2. Each contact gets a unique referral code.
3. When a referred friend makes their first purchase, both parties earn bonus points.

```typescript
// Get referral code for a contact
const { data: referral } = await reponse.loyalty.getReferral({
  path: { contactId: 'ctc_xxx' },
});
// referral → { code: "FRIEND-ABC12", referralUrl: "https://..." }
```

| Setting | Description | Default |
|---|---|---|
| `referrer_bonus` | Points awarded to the referrer | 500 |
| `referee_bonus` | Points awarded to the referred friend | 250 |
| `max_referrals` | Maximum referrals per contact | Unlimited |

## API reference

| Endpoint | Method | Description |
|---|---|---|
| `/v1/loyalty/:contactId/balance` | `GET` | Get points balance and tier |
| `/v1/loyalty/:contactId/history` | `GET` | List earn/redeem transactions |
| `/v1/loyalty/:contactId/redeem` | `POST` | Redeem points for a discount |
| `/v1/loyalty/:contactId/referral` | `GET` | Get referral code and stats |
| `/v1/loyalty/earn-rules` | `GET` | List configured earn rules |
| `/v1/loyalty/earn-rules` | `POST` | Create a new earn rule |
| `/v1/loyalty/tiers` | `GET` | List all tiers |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Points not earned on purchase | Earn rules not configured | Add a purchase earn rule in the dashboard |
| Tier not upgrading | Lifetime points below threshold | Check tier thresholds in settings |
| Redemption rejected | Balance below `min_redeem_points` | Inform the contact or lower the minimum |
| Referral code not working | Referral program disabled | Enable in Dashboard → Loyalty → Referral |
| Points balance shows 0 | Wrong `contactId` | Verify the contact ID matches the profile |
