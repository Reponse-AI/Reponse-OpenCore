---
title: "Loyalty — Referral"
description: "Récupère le code de parrainage et les stats d'un contact."
---

## Vue d'ensemble

Retourne le code de parrainage d'un contact ainsi que ses performances, pour alimenter les parcours de parrainage.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/loyalty/referral`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `contact_id` | string (uuid) | ✅ | Le contact à consulter. |


## Réponse

```json
{ "referral_code": "FRIEND-AB12", "referrals_count": 3, "points_earned": 300 }
```

## Exemple SDK

```typescript
const { data } = await reponse.loyalty.getReferral({ query: { contact_id: contactId } });
```
