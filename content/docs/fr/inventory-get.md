---
title: "Inventory — Get"
description: "Obtenir les niveaux de stock par variant_id, sku ou product_id."
---

## Vue d'ensemble

Obtenir les niveaux de stock par variant_id, sku ou product_id.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**GET** `/v1/inventory`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `variant_id` | string | ❌ | Filtrer par UUID de variante |
| `sku` | string | ❌ | Filtrer par SKU |
| `product_id` | string | ❌ | Filtrer par UUID de produit |

## Réponse

```json
{
  "data": [
    {
      "variant_id": "uuid",
      "title": "Premium T-Shirt / M / Black",
      "sku": "TS-BLK-M",
      "inventory_quantity": 42,
      "available": true,
      "product_id": "uuid"
    }
  ]
}
```

## Exemples de code

### cURL

```bash
curl -X GET https://api.reponse.ai/v1/inventory \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/inventory", {
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

## Notes

> Au moins un des paramètres variant_id, sku ou product_id est requis.
