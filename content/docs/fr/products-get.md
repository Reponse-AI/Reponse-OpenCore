---
title: "Products — Get"
description: "Récupérer un produit par UUID avec toutes ses variantes et images."
---

## Vue d'ensemble

Récupérer un produit par UUID avec toutes ses variantes et images.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**GET** `/v1/products/:id`

## Réponse

```json
{
  "id": "uuid",
  "title": "Premium T-Shirt",
  "slug": "premium-t-shirt",
  "description": "...",
  "price": 29.99,
  "compare_at_price": 39.99,
  "currency": "EUR",
  "in_stock": true,
  "images": [...],
  "variants": [...],
  "option_definitions": [...]
}
```

## Exemples de code

### cURL

```bash
curl -X GET https://api.reponse.ai/v1/products/:id \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/products/:id", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
  },
});

const data = await response.json();
console.log(data);
```

## Codes d'erreur

| Statut | Description |
| --- | --- |
| 400 | Requête invalide — paramètres incorrects |
| 401 | Non autorisé — clé API invalide ou manquante |
| 500 | Erreur serveur interne |
