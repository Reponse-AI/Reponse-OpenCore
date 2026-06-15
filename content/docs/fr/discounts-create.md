---
title: "Discounts — Create"
description: "Crée un code de réduction."
---

## Vue d'ensemble

Crée un code de réduction en pourcentage ou montant fixe pour le workspace. Les codes peuvent être `automatic` (appliqués sans saisie) ou basés sur un `code`.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/discounts`

### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `code` | string | ✅ | Le code saisi par les clients. |
| `type` | string | ✅ | `percentage` ou `fixed_amount`. |
| `value` | number | ✅ | Valeur de la remise. |
| `is_active` | boolean | ❌ | Si le code est actif (défaut true). |


## Réponse

```json
{ "data": { "id": "disc_uuid", "code": "WELCOME10", "type": "percentage", "value": 10 } }
```

## Exemple SDK

```typescript
await reponse.discounts.create({ body: { code: "WELCOME10", type: "percentage", value: 10 } });
```
