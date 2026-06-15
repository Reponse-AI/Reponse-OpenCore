---
title: "Checkout — Stripe"
description: "Créer une session Stripe Checkout pour un panier. Support multi-marché, abonnements, taxe automatique et codes de réduction."
---

## Vue d'ensemble

Créer une session Stripe Checkout pour un panier. Support multi-marché, abonnements, taxe automatique et codes de réduction.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**POST** `/v1/checkout/stripe`

### Corps de la requête

```json
{
  "cart_id": "cart_uuid",
  "market_id": "market_uuid",
  "success_url": "https://yourstore.com/success",
  "cancel_url": "https://yourstore.com/cancel"
}
```

## Réponse

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_...",
  "sessionId": "cs_..."
}
```

## Exemples de code

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/checkout/stripe \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "cart_id": "cart_uuid",
  "market_id": "market_uuid",
  "success_url": "https://yourstore.com/success",
  "cancel_url": "https://yourstore.com/cancel"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/checkout/stripe", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "cart_id": "cart_uuid",
  "market_id": "market_uuid",
  "success_url": "https://yourstore.com/success",
  "cancel_url": "https://yourstore.com/cancel"
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

> Détecte automatiquement les abonnements et passe en mode 'subscription' Stripe. Utilise une stratégie double de réduction (moteur de promotions + legacy).
