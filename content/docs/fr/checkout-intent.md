---
title: "Checkout — Payment Intent"
description: "Crée un PaymentIntent Stripe pour un panier (checkout headless / embarqué)."
---

## Vue d'ensemble

Résout le contexte marché, applique remises et livraison, puis crée un PaymentIntent Stripe. Retourne le `client_secret` à utiliser côté client pour confirmer le paiement. Nécessite une clé secrète Stripe configurée sur le workspace.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/checkout/intent`

### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `cart_id` | string (uuid) | ✅ | Panier à régler. |
| `market_id` | string (uuid) | ❌ | Contexte marché (défaut: domestique). |
| `customer_email` | string | ❌ | Email du client. |
| `shipping_address` | object | ❌ | Adresse de livraison pour le calcul des frais. |
| `discount_codes` | string[] | ❌ | Codes à appliquer au checkout. |


## Réponse

```json
{
  "client_secret": "pi_..._secret_...",
  "amount": 5398,
  "currency": "eur",
  "breakdown": { "subtotal": 5998, "discount": 600, "shipping": 0 }
}
```

## Exemple SDK

```typescript
const { data } = await reponse.checkout.createIntent({
  body: { cart_id: cartId, customer_email: "buyer@example.com" }
});
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `cart_id` requis, Stripe non configuré, ou aucun marché. |
| `404` | Panier introuvable. |
