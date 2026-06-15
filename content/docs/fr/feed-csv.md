---
title: "Product Feed — CSV"
description: "Récupère le flux produits en CSV."
---

## Vue d'ensemble

Retourne le catalogue produits actif sous forme de fichier CSV, adapté à Google Merchant Center et autres canaux à base de flux.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/feed/csv`

## Réponse

```json
id,title,price,availability,link
prod_uuid,T-shirt Logo,29.99 EUR,in stock,https://...
```

## Exemple SDK

```typescript
const res = await fetch(`${baseUrl}/api/v1/feed/csv`, { headers: { Authorization: `Bearer ${apiKey}` } });
```
