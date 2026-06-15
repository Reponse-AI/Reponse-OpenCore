---
title: "Discounts — Validate"
description: "Valider un code de réduction par rapport au contexte du panier. Vérifie le statut actif, la validité des dates, les limites d'utilisation et les minimums de commande."
---

## Vue d'ensemble

Valider un code de réduction par rapport au contexte du panier. Vérifie le statut actif, la validité des dates, les limites d'utilisation et les minimums de commande.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**POST** `/v1/discounts/validate`

### Corps de la requête

```json
{
  "code": "SUMMER20",
  "cart_total": 59.98,
  "cart_quantity": 2,
  "customer_tier": "warm"
}
```

## Réponse

```json
{
  "valid": true,
  "discount": {
    "id": "discount_uuid",
    "code": "SUMMER20",
    "type": "percentage",
    "value": 20,
    "savings": 11.99,
    "discount_class": "order"
  }
}
```

## Exemples de code

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/discounts/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "code": "SUMMER20",
  "cart_total": 59.98,
  "cart_quantity": 2,
  "customer_tier": "warm"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/discounts/validate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "code": "SUMMER20",
  "cart_total": 59.98,
  "cart_quantity": 2,
  "customer_tier": "warm"
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

> Hiérarchie des tiers : cold → warm → hot → vip. Un code requérant le tier 'warm' accepte les clients warm, hot et vip.
