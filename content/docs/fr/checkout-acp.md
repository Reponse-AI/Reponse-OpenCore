---
title: "Checkout — ACP"
description: "Checkout via le protocole Agentic Commerce. Accepte un Shared Payment Token (SPT) d'agents AI pour compléter un achat."
---

## Vue d'ensemble

Checkout via le protocole Agentic Commerce. Accepte un Shared Payment Token (SPT) d'agents AI pour compléter un achat.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**POST** `/v1/checkout/acp`

### Corps de la requête

```json
{
  "cart_id": "cart_uuid",
  "payment_token": "spt_...",
  "shipping_address": { "line1": "...", "city": "...", "country": "FR" },
  "customer_email": "customer@example.com",
  "idempotency_key": "unique_key"
}
```

## Réponse

```json
{
  "checkout_session_id": "cs_uuid",
  "status": "completed",
  "payment_intent_id": "pi_...",
  "order_summary": {
    "currency": "EUR",
    "subtotal": 59.98,
    "discount": 5.00,
    "shipping": 4.99,
    "total": 59.97,
    "line_items": [...]
  }
}
```

## Exemples de code

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/checkout/acp \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "cart_id": "cart_uuid",
  "payment_token": "spt_...",
  "shipping_address": { "line1": "...", "city": "...", "country": "FR" },
  "customer_email": "customer@example.com",
  "idempotency_key": "unique_key"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/checkout/acp", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "cart_id": "cart_uuid",
  "payment_token": "spt_...",
  "shipping_address": { "line1": "...", "city": "...", "country": "FR" },
  "customer_email": "customer@example.com",
  "idempotency_key": "unique_key"
}),
});

const data = await response.json();
console.log(data);
```

## Codes d'erreur

| Statut | Description |
| --- | --- |
| 400 | Requête invalide — paramètres incorrects |
| 401 | Non autorisé — clé API invalide ou manquante |
| 404 | Non trouvé — la ressource n'existe pas |
| 500 | Erreur serveur interne |

## Notes

> Utilise confirm:true et allow_redirects:'never' sur le PaymentIntent. Gère le refus de carte (402) et le token invalide (400).
