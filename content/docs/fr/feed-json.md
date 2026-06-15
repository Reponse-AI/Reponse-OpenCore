---
title: "Product Feed — JSON"
description: "Récupère le flux produits en JSON compatible ACP (gzippé)."
---

## Vue d'ensemble

Retourne tout le catalogue produits actif sous forme de flux JSON gzippé, dans un format compatible Agentic Commerce Protocol. À utiliser pour synchroniser le catalogue vers des agents et marketplaces.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/feed`

## Réponse

```json
{ "products": [ { "id": "prod_uuid", "title": "T-shirt Logo", "price": 29.99, "availability": "in_stock" } ] }
```

## Exemple SDK

```typescript
const res = await fetch(`${baseUrl}/api/v1/feed`, { headers: { Authorization: `Bearer ${apiKey}` } });
```
