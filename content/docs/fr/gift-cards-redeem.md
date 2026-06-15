---
title: "Gift Cards — Redeem"
description: "Utilise un montant sur une carte cadeau."
---

## Vue d'ensemble

Déduit un montant du solde d'une carte cadeau, optionnellement lié à une commande. Échoue si la carte n'est pas active ou si le montant est invalide.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/gift-cards/redeem`

### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `code` | string | ✅ | Code de la carte cadeau. |
| `amount` | number | ✅ | Montant à utiliser (doit être positif). |
| `order_id` | string (uuid) | ❌ | Commande à laquelle rattacher l'utilisation. |


## Réponse

```json
{ "redeemed": 20.00, "remaining_balance": 30.00, "currency": "EUR" }
```

## Exemple SDK

```typescript
await reponse.giftCards.redeem({ body: { code: "GIFT-XXXX", amount: 20.00 } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `code` et `amount` requis, ou montant non positif. |
| `404` | Carte cadeau introuvable. |
| `422` | Carte cadeau non active. |
