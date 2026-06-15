---
title: "Cart — Apply Promotion"
description: "Applique un code promotion ou remise à un panier."
---

## Vue d'ensemble

Valide un code et applique l'ajustement correspondant au panier. L'endpoint lit d'abord la table `promotions`, puis se rabat sur `discount_codes` (codes migrés de Shopify). Le panier doit être `open`.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/carts/:id/promotions`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | L'ID du panier. |


### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `code` | string | ✅ | Code promotion (insensible à la casse). |


## Réponse

```json
{ "applied": true, "code": "SUMMER20", "savings": 12.00, "total": 47.98 }
```

## Exemple SDK

```typescript
await reponse.cart.applyPromotion({ path: { id: cartId }, body: { code: "SUMMER20" } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `code` requis, panier non ouvert, ou promotion inactive/expirée. |
| `404` | Panier introuvable. |
