---
title: "Gift Cards — List"
description: "Liste les cartes cadeaux d'un workspace."
---

## Vue d'ensemble

Retourne les cartes cadeaux, optionnellement filtrées par statut ou par un code précis.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/gift-cards`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `status` | string | ❌ | Filtre par statut (ex. `active`). |
| `code` | string | ❌ | Recherche un code précis. |


## Réponse

```json
{ "data": [ { "code": "GIFT-XXXX", "balance": 50.00, "currency": "EUR", "status": "active" } ] }
```

## Exemple SDK

```typescript
const { data } = await reponse.giftCards.list({ query: { status: "active" } });
```
