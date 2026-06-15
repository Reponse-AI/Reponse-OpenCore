---
title: "Orders — Refund"
description: "Rembourse tout ou partie d'une commande."
---

## Vue d'ensemble

Émet un remboursement via Stripe. Omettez `amount` pour un remboursement total, ou indiquez un montant pour un remboursement partiel.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/orders/:orderId/refund`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `orderId` | string (uuid) | ✅ | L'ID de la commande. |


### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `amount` | number | ❌ | Montant à rembourser (total si omis). |
| `reason` | string | ❌ | Motif (défaut `requested_by_customer`). |
| `note` | string | ❌ | Note interne. |


## Réponse

```json
{ "refund": { "id": "re_...", "amount": 53.98, "status": "succeeded" } }
```

## Exemple SDK

```typescript
await reponse.orders.refund({ path: { orderId }, body: { amount: 10.00, note: "Damaged item" } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `404` | Commande introuvable. |
