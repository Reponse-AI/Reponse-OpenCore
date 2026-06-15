---
title: "Collections — List"
description: "Liste toutes les collections actives d'un workspace."
---

## Vue d'ensemble

Retourne les collections actives avec leur nombre de produits, en pagination par curseur. Adossé à la table `collections` (unique par workspace via le handle).

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/collections`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `limit` | number | ❌ | Résultats max par page (défaut 50). |
| `cursor` | string | ❌ | Curseur de pagination (created_at du dernier item). |


## Réponse

```json
{
  "data": [
    { "id": "col_uuid", "title": "Summer", "handle": "summer", "product_count": 24 }
  ],
  "next_cursor": null,
  "has_more": false
}
```

## Exemple SDK

```typescript
const { data } = await reponse.catalog.listCollections({ query: { limit: 50 } });
```
