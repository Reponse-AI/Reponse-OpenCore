---
title: "Cart — Update Item"
description: "Met à jour la quantité d'une ligne de panier."
---

## Vue d'ensemble

Définit une nouvelle quantité pour une ligne. Mettre la quantité à `0` supprime la ligne. Les totaux sont recalculés automatiquement.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**PUT** `/v1/carts/:id/items/:lineId`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | L'ID du panier. |
| `lineId` | string (uuid) | ✅ | L'ID de la ligne. |


### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `quantity` | number | ✅ | Nouvelle quantité (0 supprime la ligne). |


## Réponse

```json
{ "id": "cart_uuid", "subtotal": 29.99, "total": 29.99, "cart_lines": [ /* ... */ ] }
```

## Exemple SDK

```typescript
await reponse.cart.updateItem({
  path: { id: cartId, lineId },
  body: { quantity: 3 }
});
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | Quantité invalide (nombre >= 0). |
| `404` | Panier introuvable. |
