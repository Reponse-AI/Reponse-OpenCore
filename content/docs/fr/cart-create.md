---
title: "Cart — Create"
description: "Créer un nouveau panier avec des articles initiaux."
---

## Vue d'ensemble

Créer un nouveau panier avec des articles initiaux.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**POST** `/v1/carts`

### Corps de la requête

```json
{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "currency": "EUR"
}
```

## Réponse

```json
{
  "id": "cart_uuid",
  "items": [
    {
      "id": "line_uuid",
      "product_id": "uuid",
      "variant_id": "variant_uuid",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "subtotal": 59.98,
  "currency": "EUR",
  "created_at": "2025-01-01T00:00:00Z"
}
```

## Exemples de code

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/carts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "currency": "EUR"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/carts", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "currency": "EUR"
}),
});

const data = await response.json();
console.log(data);
```

## Codes d'erreur

| Statut | Description |
| --- | --- |
| 400 | Requête invalide — paramètres incorrects |
| 401 | Non autorisé — clé API invalide ou manquante |
| 404 | Non trouvé — la ressource n'existe pas |
| 500 | Erreur serveur interne |
