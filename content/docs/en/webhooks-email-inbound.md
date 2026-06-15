---
title: "Email Inbound"
description: "Inbound email webhooks for support."
---

## Overview

The inbound email webhook turns customer email replies into support tickets inside Reponse. When a customer sends an email to `support@{slug}.reponse.ai`, the email provider (SendGrid Inbound Parse) forwards the parsed message to Reponse. The handler matches or creates a contact, finds an existing open ticket or creates a new one, and attaches the email body as a public note.

**Endpoint:** `POST /api/webhooks/email-inbound`

## Configuration

### 1. Set up SendGrid Inbound Parse

1. In the [SendGrid Dashboard](https://app.sendgrid.com/), go to **Settings → Inbound Parse**.
2. Add a new host/URL:
   - **Receiving domain:** `{slug}.reponse.ai` (use your workspace slug)
   - **Destination URL:** `https://api.reponse.ai/api/webhooks/email-inbound`
3. Enable **POST the raw, full MIME message** or use the parsed JSON format.

### 2. Configure the webhook secret

Set the `EMAIL_WEBHOOK_SECRET` environment variable. The handler validates every request against this shared secret.

### 3. DNS setup

Add an MX record for `{slug}.reponse.ai` pointing to SendGrid's inbound parse servers:

```
MX  {slug}.reponse.ai  mx.sendgrid.net  10
```

## Authentication

The handler uses a shared secret in the `X-Webhook-Secret` header:

```typescript
const secret = req.headers.get("x-webhook-secret");

if (secret !== process.env.EMAIL_WEBHOOK_SECRET) {
  return new Response("Unauthorized", { status: 401 });
}
```

> **Note:** This is not HMAC-based — it's a simple shared secret comparison. Ensure the secret is long and random (e.g. 64 hex characters).

## Payload structure

The webhook expects a JSON body in the SendGrid Inbound Parse format:

```json
{
  "from": "Jane Doe <jane@example.com>",
  "to": "support@my-store.reponse.ai",
  "subject": "Order issue #2026-0042",
  "text": "Hi, I received the wrong size. Can you help me exchange it?\n\nThanks,\nJane",
  "html": "<p>Hi, I received the wrong size. Can you help me exchange it?</p><p>Thanks,<br>Jane</p>"
}
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `from` | `string` | ✅ | Sender email, optionally with display name: `"Name <email>"` |
| `to` | `string` | ✅ | Recipient address: `support@{slug}.reponse.ai` |
| `subject` | `string` | Optional | Email subject line. Defaults to `"(No subject)"` |
| `text` | `string` | Optional | Plain-text body |
| `html` | `string` | Optional | HTML body (used as fallback if `text` is empty) |

## Processing flow

```
Customer email → SendGrid Inbound Parse
  ↓ POST /api/webhooks/email-inbound
  ↓ Verify X-Webhook-Secret
  ↓ Extract workspace slug from TO address
  ↓ Lookup workspace by slug
  ↓ Parse sender email/name from FROM address
  ↓ Find or create contact by email_normalized
  ↓ Search for existing open ticket (same contact + subject)
  ↓
  ├─ Ticket found → Add note to existing ticket
  │                  Update last_activity_at
  │                  Return { action: "note_added" }
  │
  └─ No ticket   → Create new ticket (source: "email", priority: "normal")
                    Add email body as first public note
                    Return { action: "ticket_created" }
```

## Response format

### Successful processing

```json
{
  "ok": true,
  "ticket_id": "ticket_uuid_here",
  "action": "ticket_created"
}
```

or

```json
{
  "ok": true,
  "ticket_id": "ticket_uuid_here",
  "action": "note_added"
}
```

### Error responses

| Status | Body | Cause |
|---|---|---|
| `401` | `{ "error": "Unauthorized" }` | Missing or invalid webhook secret |
| `400` | `{ "error": "Missing required fields: from, to" }` | Payload missing `from` or `to` |
| `400` | `{ "error": "Invalid recipient address" }` | TO address doesn't match `support@{slug}.reponse.ai` pattern |
| `404` | `{ "error": "Workspace not found" }` | No workspace matches the extracted slug |
| `500` | `{ "error": "Failed to create ticket" }` | Database error during ticket creation |

## Email address parsing

The handler supports multiple FROM address formats:

| Format | Parsed email | Parsed name |
|---|---|---|
| `user@example.com` | `user@example.com` | `null` |
| `User Name <user@example.com>` | `user@example.com` | `User Name` |
| `"User Name" <user@example.com>` | `user@example.com` | `User Name` |

For the TO address, the handler scans all recipients (comma-separated) and picks the first one matching `support@{slug}.reponse.ai`.

## Ticket threading

Existing tickets are matched by:
1. Same `workspace_id`
2. Same `contact_id`
3. Same `subject` line
4. Status is `open` or `pending_customer`

If a match is found, the email body is added as a new `ticket_note` (public, not AI-generated) and the ticket's `last_activity_at` is updated. Otherwise, a new ticket is created.

## Best practices

1. **Use a unique slug per workspace** — the slug in the email address is how the handler routes to the correct workspace.
2. **Set up SPF/DKIM for your domain** — ensures emails are delivered to SendGrid without being rejected.
3. **Keep the webhook secret in environment variables** — never hardcode `EMAIL_WEBHOOK_SECRET`.
4. **Handle multi-recipient emails** — the handler scans all TO addresses, so CC'd emails to other addresses won't break routing.
5. **Monitor ticket creation** — set up alerts for high volumes of inbound emails that create new tickets.
6. **Consider auto-categorisation** — the default category is `"other"`. You can enhance the handler with AI-based intent classification in the future.
