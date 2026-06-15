---
title: "Inventory — Update"
description: "Mettre à jour la quantité en stock. Supporte les modes 'set' (absolu) et 'adjust' (relatif)."
---

## Vue d'ensemble

Mettre à jour la quantité en stock. Supporte les modes 'set' (absolu) et 'adjust' (relatif).

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <your_api_key>
```

## Requête

**POST** `/v1/inventory`

### Corps de la requête

```json
{
  "variant_id": "uuid",
  "quantity": 10,
  "mode": "adjust",
  "reason": "Restock from supplier"
}
```

## Réponse

```json
{
  "success": true,
  "variant_id": "uuid",
  "old_quantity": 42,
  "new_quantity": 52,
  "change": 10
}
```

## Exemples de code

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/inventory \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "variant_id": "uuid",
  "quantity": 10,
  "mode": "adjust",
  "reason": "Restock from supplier"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/inventory", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "variant_id": "uuid",
  "quantity": 10,
  "mode": "adjust",
  "reason": "Restock from supplier"
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

## Notes

> Protège contre l'inventaire négatif. Tous les changements sont journalisés dans inventory_ledger.
