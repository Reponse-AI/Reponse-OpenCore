---
title: "Orders — Get"
description: "Liste les commandes d'un workspace, avec filtre de statut optionnel."
---

## Vue d'ensemble

Retourne les commandes du workspace authentifié. Filtrez par statut et paginez pour construire un historique. Les actions sur une commande (fulfill, refund, cancel) ont des endpoints dédiés.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/orders`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `status` | string | ❌ | Filtre par statut de commande. |
| `limit` | number | ❌ | Résultats max (défaut 50). |


## Réponse

```json
{ "data": [ { "id": "order_uuid", "status": "paid", "total": 53.98, "currency": "EUR" } ] }
```

## Exemple SDK

```typescript
const { data } = await reponse.orders.list({ query: { status: "paid", limit: 50 } });
```
