---
title: "Cart — Remove Item"
description: "Supprime une ligne d'un panier."
---

## Vue d'ensemble

Supprime entièrement une ligne du panier et recalcule les totaux. Équivaut à mettre la quantité de la ligne à `0`.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**DELETE** `/v1/carts/:id/items/:lineId`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | L'ID du panier. |
| `lineId` | string (uuid) | ✅ | L'ID de la ligne. |


## Réponse

```json
{ "id": "cart_uuid", "subtotal": 0, "total": 0, "cart_lines": [] }
```

## Exemple SDK

```typescript
await reponse.cart.removeItem({ path: { id: cartId, lineId } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `404` | Panier ou ligne introuvable. |
