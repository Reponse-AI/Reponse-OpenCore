---
title: "Orders — Confirm"
description: "Confirme une commande après un PaymentIntent réussi."
---

## Vue d'ensemble

Transforme un panier en commande payée une fois le PaymentIntent Stripe réussi. Fournissez à la fois `payment_intent_id` et le `cart_id` d'origine.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/orders/confirm`

### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `payment_intent_id` | string | ✅ | ID du PaymentIntent Stripe. |
| `cart_id` | string (uuid) | ✅ | Panier réglé. |


## Réponse

```json
{ "order": { "id": "order_uuid", "status": "paid", "total": 53.98 } }
```

## Exemple SDK

```typescript
const { data } = await reponse.orders.confirm({
  body: { payment_intent_id: "pi_...", cart_id: cartId }
});
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `payment_intent_id` ou `cart_id` manquant, ou Stripe non configuré. |
