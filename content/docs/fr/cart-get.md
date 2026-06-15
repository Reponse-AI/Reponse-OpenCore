---
title: "Cart — Get"
description: "Récupère un panier avec ses lignes, ses totaux et les remises automatiques appliquées."
---

## Vue d'ensemble

Retourne un panier par son ID, avec ses lignes (et les détails produit) ainsi que les remises automatiques actives pour le workspace. Le panier doit appartenir au workspace authentifié.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/carts/:id`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | L'ID du panier. |


## Réponse

```json
{
  "id": "cart_uuid",
  "currency": "EUR",
  "subtotal": 59.98,
  "total": 53.98,
  "discounts": [
    { "code": "WELCOME10", "type": "percentage", "value": 10, "savings": 6.00 }
  ],
  "cart_lines": [
    {
      "id": "line_uuid",
      "quantity": 2,
      "price_at_add": 29.99,
      "products": { "id": "prod_uuid", "title": "T-shirt Logo", "handle": "t-shirt-logo" }
    }
  ]
}
```

## Exemple SDK

```typescript
const { data: cart } = await reponse.cart.get({ path: { id: cartId } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `404` | Panier introuvable ou hors de ce workspace. |
| `401` | Clé API manquante ou invalide. |
