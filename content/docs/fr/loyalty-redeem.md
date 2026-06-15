---
title: "Loyalty — Redeem"
description: "Utilise les points fidélité d'un contact."
---

## Vue d'ensemble

Déduit des points du solde d'un contact selon le programme de fidélité du workspace, optionnellement sur une commande précise.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/loyalty/redeem`

### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `contact_id` | string (uuid) | ✅ | Le contact qui utilise les points. |
| `points` | number | ✅ | Points à utiliser. |
| `order_id` | string (uuid) | ❌ | Commande sur laquelle appliquer la récompense. |


## Réponse

```json
{ "redeemed_points": 500, "discount_value": 5.00, "remaining_balance": 700 }
```

## Exemple SDK

```typescript
await reponse.loyalty.redeem({ body: { contact_id: contactId, points: 500 } });
```
