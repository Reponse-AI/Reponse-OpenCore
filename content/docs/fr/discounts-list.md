---
title: "Discounts — List"
description: "Liste les codes de réduction d'un workspace."
---

## Vue d'ensemble

Retourne les codes de réduction avec filtres optionnels par état actif et type, en pagination par offset.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/discounts`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `active` | boolean | ❌ | Filtre par état actif. |
| `type` | string | ❌ | Filtre par type de remise. |
| `limit` | number | ❌ | Résultats max (défaut 50). |
| `offset` | number | ❌ | Items à ignorer (défaut 0). |


## Réponse

```json
{ "data": [ { "code": "WELCOME10", "type": "percentage", "value": 10, "is_active": true } ], "total": 12 }
```

## Exemple SDK

```typescript
const { data } = await reponse.discounts.list({ query: { active: true } });
```
