---
title: "Cart — Add Item"
description: "Ajoute un ou plusieurs articles à un panier existant."
---

## Vue d'ensemble

Ajoute des lignes à un panier. Pour les produits à plusieurs variantes, `variant_id` est requis. Les totaux du panier sont recalculés automatiquement après l'ajout.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/carts/:id/items`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | L'ID du panier. |


### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `items` | array | ✅ | Tableau d'articles à ajouter. |
| `items[].product_id` | string (uuid) | ✅ | Produit à ajouter. |
| `items[].variant_id` | string (uuid) | ❌ | Requis si le produit a plusieurs variantes. |
| `items[].quantity` | number | ✅ | Quantité à ajouter. |


## Réponse

```json
{ "id": "cart_uuid", "subtotal": 89.97, "total": 89.97, "cart_lines": [ /* ... */ ] }
```

## Exemple SDK

```typescript
await reponse.cart.addItem({
  path: { id: cartId },
  body: { items: [{ product_id: "prod_uuid", variant_id: "var_uuid", quantity: 2 }] }
});
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `variant_id` requis pour un produit multi-variantes. |
| `404` | Panier introuvable. |
