---
title: "Orders — Cancel"
description: "Annuler une commande. Inclut des gardes : vérification d'identité, validation d'état, limitation de débit (1/heure, 3/30 jours) et prévention d'abus."
---

## Vue d'ensemble

Annuler une commande. Inclut des gardes : vérification d'identité, validation d'état, limitation de débit (1/heure, 3/30 jours) et prévention d'abus.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**POST** `/v1/orders/:orderId/cancel`

### Corps de la requête

```json
{
  "reason": "customer_changed_mind",
  "custom_reason": "Optional explanation"
}
```

## Réponse

```json
{
  "success": true,
  "confirmation_message": "Order has been cancelled.",
  "event_id": "event_uuid"
}
```

## Exemples de code

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/orders/:orderId/cancel \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "reason": "customer_changed_mind",
  "custom_reason": "Optional explanation"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/orders/:orderId/cancel", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "reason": "customer_changed_mind",
  "custom_reason": "Optional explanation"
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

> Raisons valides : customer_changed_mind, wrong_item_ordered, delivery_too_slow_anticipated, found_better_price, payment_issue, other.
