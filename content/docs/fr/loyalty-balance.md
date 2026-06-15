---
title: "Loyalty — Balance"
description: "Récupère le solde de points fidélité et le palier d'un contact."
---

## Vue d'ensemble

Retourne le solde de points, le total cumulé gagné et le palier actuel d'un contact. Retourne un solde à zéro si le contact n'a pas encore d'enregistrement fidélité.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/loyalty`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `contact_id` | string (uuid) | ✅ | Le contact à consulter. |


## Réponse

```json
{
  "points_balance": 1200,
  "points_earned_total": 3400,
  "tier": { "id": "tier_uuid", "name": "Gold", "slug": "gold" }
}
```

## Exemple SDK

```typescript
const { data } = await reponse.loyalty.getBalance({ query: { contact_id: contactId } });
```
