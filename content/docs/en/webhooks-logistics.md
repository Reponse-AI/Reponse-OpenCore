---
title: "Logistics"
description: "Logistics and shipping webhooks."
---

## Overview

Logistics webhooks update fulfillment and tracking state as carriers progress a shipment. When a parcel moves through transit stages (picked up, in transit, delivered, exception), the logistics provider sends an event to Reponse so order fulfillment records stay current and customer notifications can be triggered.

**Endpoint:** `POST /api/webhooks/logistics?provider={name}&workspaceId={id}`

## Configuration

1. In your logistics provider's dashboard (e.g. Sendcloud), navigate to **Settings → Webhooks** or **Integrations → Webhooks**.
2. Add the endpoint URL with query parameters:
   ```
   https://api.reponse.ai/api/webhooks/logistics?provider=sendcloud&workspaceId={your_workspace_id}
   ```
3. For Sendcloud: copy the **Webhook Secret** and save it in your workspace's `fulfillment_config.sendcloud_webhook_secret`.

### Supported providers

| Provider | Status | Query param |
|---|---|---|
| **Sendcloud** | ✅ Active | `provider=sendcloud` |
| **ShipStation** | 🚧 Planned | `provider=shipstation` |
| **Easyship** | 🚧 Planned | `provider=easyship` |
| **Shippo** | 🚧 Planned | `provider=shippo` |
| **Amazon MCF** | 🚧 Planned | `provider=amazon_mcf` |
| **ShipBob** | 🚧 Planned | `provider=shipbob` |
| **Flexport** | 🚧 Planned | `provider=flexport` |
| **Cubyn** | 🚧 Planned | `provider=cubyn` |

## Signature verification (Sendcloud)

Sendcloud signs webhook payloads with HMAC-SHA256. Reponse verifies the signature before processing:

```typescript
import crypto from "crypto";

const signature = req.headers.get("sendcloud-signature");
const secret = workspace.fulfillment_config.sendcloud_webhook_secret;

const hmac = crypto.createHmac("sha256", secret);
const computedSignature = hmac.update(rawBody).digest("hex");

if (computedSignature !== signature) {
  return new Response("Unauthorized", { status: 401 });
}
```

## Events

### Sendcloud — `parcel_status_changed`

Fired whenever a parcel's status changes in the Sendcloud system. The handler updates the matching fulfillment record with the new status and tracking URL.

**Payload example:**

```json
{
  "action": "parcel_status_changed",
  "parcel": {
    "id": 123456789,
    "order_number": "ORD-2026-0042",
    "tracking_number": "3SXYZ1234567890",
    "tracking_url": "https://tracking.sendcloud.sc/forward?carrier=postnl&code=3SXYZ1234567890",
    "carrier": {
      "code": "postnl"
    },
    "status": {
      "id": 11,
      "message": "Delivered"
    },
    "weight": "0.500",
    "to_postal_code": "75001",
    "to_country": "FR",
    "shipment": {
      "id": 987654321,
      "name": "PostNL Standard"
    }
  },
  "timestamp": "2026-05-22T16:45:00Z"
}
```

### Status mapping

| Sendcloud status ID | Status message | Typical Reponse mapping |
|---|---|---|
| 1 | Announced | `pending` |
| 3 | En route to sorting center | `in_transit` |
| 4 | Sorting | `in_transit` |
| 6 | Sorted | `in_transit` |
| 8 | Delivery attempt failed | `exception` |
| 11 | Delivered | `delivered` |
| 12 | Returned to sender | `returned` |
| 62 | Being returned | `returning` |
| 999 | Unknown | `exception` |

## Processing flow

```
Logistics provider (e.g. Sendcloud)
  ↓ POST /api/webhooks/logistics?provider=sendcloud&workspaceId=ws_123
  ↓ Verify signature (HMAC-SHA256)
  ↓ Parse payload
  ↓ Match order by order_number + workspace_id
  ↓ Upsert fulfillment record (status, tracking_url, tracking_number)
  ↓ Optionally trigger customer notification
  ↓ Return 200 OK
```

## Retry policy

| Provider | Retry behaviour |
|---|---|
| Sendcloud | Retries on non-`2xx`, up to 5 attempts with linear backoff over 24 hours |
| ShipStation | *(planned)* Retries with exponential backoff |

## Best practices

1. **Always include both query params** — `provider` and `workspaceId` are required; requests without them return `400`.
2. **Store the webhook secret securely** — the Sendcloud secret is stored in `fulfillment_config` on the workspace, not in environment variables.
3. **Handle unknown providers gracefully** — the handler logs the payload and returns `400` for unrecognised providers.
4. **Monitor parcel exceptions** — status `8` (delivery attempt failed) and `999` (unknown) should trigger merchant alerts.
5. **Prepare for multi-provider** — the architecture supports multiple logistics providers per workspace. The `provider` query param routes to the correct handler.
