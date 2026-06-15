---
title: "Orders — Fulfill"
description: "Marque une commande comme expédiée et attache le suivi."
---

## Vue d'ensemble

Enregistre l'expédition d'une commande avec les infos de suivi et envoie optionnellement l'email de notification au client.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/orders/:orderId/fulfill`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `orderId` | string (uuid) | ✅ | L'ID de la commande. |


### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `tracking_number` | string | ✅ | Numéro de suivi transporteur. |
| `tracking_company` | string | ❌ | Nom du transporteur. |
| `tracking_url` | string | ❌ | URL de suivi. |
| `send_email` | boolean | ❌ | Envoyer l'email d'expédition (défaut true). |


## Réponse

```json
{ "order": { "id": "order_uuid", "status": "fulfilled" } }
```

## Exemple SDK

```typescript
await reponse.orders.fulfill({
  path: { orderId },
  body: { tracking_number: "1Z999...", tracking_company: "UPS" }
});
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `tracking_number` requis. |
| `404` | Commande introuvable. |
