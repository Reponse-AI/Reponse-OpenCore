---
title: "Geocode"
description: "Résout une adresse en texte libre en données de localisation structurées."
---

## Vue d'ensemble

Géocode une chaîne d'adresse en champs structurés (rue, ville, code postal, pays, coordonnées). Utile pour l'autocomplétion et la validation d'adresse au checkout.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/utils/geocode`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `query` | string | ✅ | Adresse en texte libre à résoudre. |


## Réponse

```json
{ "results": [ { "address1": "10 Downing St", "city": "London", "country": "GB", "lat": 51.5, "lng": -0.12 } ] }
```

## Exemple SDK

```typescript
const { data } = await reponse.utils.geocode({ query: { query: "10 Downing St London" } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | Paramètre `query` manquant. |
