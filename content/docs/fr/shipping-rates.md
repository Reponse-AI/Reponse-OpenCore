---
title: "Shipping — Rates"
description: "Récupère les tarifs de livraison disponibles pour un marché et un panier."
---

## Vue d'ensemble

Résout les tarifs de livraison pour un marché donné, affinés optionnellement par le contenu du panier et le pays de destination. Utilisez les tarifs retournés au checkout.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/shipping/rates`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `market_id` | string (uuid) | ✅ | Marché pour lequel résoudre les tarifs. |
| `cart_id` | string (uuid) | ❌ | Panier pour les règles de poids/seuil. |
| `country` | string | ❌ | Code pays de destination. |


## Réponse

```json
{ "rates": [ { "id": "rate_std", "name": "Standard", "price": 4.90, "currency": "EUR" } ] }
```

## Exemple SDK

```typescript
const { data } = await reponse.shipping.getRates({ query: { market_id: marketId, cart_id: cartId } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `market_id` requis. |
| `404` | Marché introuvable. |
