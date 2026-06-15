---
title: "Collections — Products"
description: "Liste les produits appartenant à une collection."
---

## Vue d'ensemble

Retourne les produits actifs d'une collection, via la jointure `collection_products`, en pagination par offset. À utiliser pour afficher une vraie page collection plutôt que tout le catalogue.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/collections/:handle/products`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `handle` | string | ✅ | Le handle de la collection. |


### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `limit` | number | ❌ | Résultats max (défaut 50, max 100). |
| `offset` | number | ❌ | Items à ignorer (défaut 0). |


## Réponse

```json
{
  "products": [ { "id": "prod_uuid", "title": "T-shirt Logo", "price": 29.99 } ],
  "total": 24,
  "limit": 50,
  "offset": 0
}
```

## Exemple SDK

```typescript
const res = await fetch(
  `${baseUrl}/api/v1/collections/summer/products?limit=50`,
  { headers: { Authorization: `Bearer ${apiKey}` } }
);
```
