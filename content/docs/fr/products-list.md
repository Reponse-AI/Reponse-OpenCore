---
title: "Products — List"
description: "Lister tous les produits actifs d'un workspace avec pagination par curseur et filtrage."
---

## Vue d'ensemble

Lister tous les produits actifs d'un workspace avec pagination par curseur et filtrage.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**GET** `/v1/products`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `limit` | number | ❌ | Nombre max de résultats par page (défaut : 50) |
| `cursor` | string | ❌ | Curseur de pagination (created_at du dernier élément) |
| `query` | string | ❌ | Recherche par titre (insensible à la casse) |
| `slug` | string | ❌ | Correspondance exacte du handle produit |

## Réponse

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Premium T-Shirt",
      "slug": "premium-t-shirt",
      "price": 29.99,
      "currency": "EUR",
      "in_stock": true,
      "images": ["https://..."],
      "variants": [...]
    }
  ],
  "next_cursor": "2025-01-01T00:00:00Z",
  "has_more": true
}
```

## Exemples de code

### cURL

```bash
curl -X GET https://api.reponse.ai/v1/products \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/products", {
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
