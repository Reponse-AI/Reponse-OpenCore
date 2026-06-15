---
title: "Collections — Get"
description: "Récupère une collection par son handle."
---

## Vue d'ensemble

Retourne une collection active identifiée par son handle, avec ses champs SEO et le nombre de produits qu'elle contient.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/collections/:handle`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `handle` | string | ✅ | Le handle de la collection. |


## Réponse

```json
{
  "data": {
    "id": "col_uuid",
    "title": "Summer",
    "handle": "summer",
    "description": "Warm-weather essentials",
    "seo_title": "Summer Collection",
    "product_count": 24
  }
}
```

## Exemple SDK

```typescript
const { data } = await reponse.catalog.getCollection({ path: { handle: "summer" } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `404` | Collection introuvable ou inactive. |
