---
title: "Theme — Get"
description: "Récupère les réglages de thème du storefront du workspace."
---

## Vue d'ensemble

Retourne la configuration de thème (couleurs, typographie, assets de marque) du workspace authentifié, pour styliser les storefronts et le checkout embarqué de façon cohérente.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/theme`

## Réponse

```json
{ "theme": { "primary_color": "#0A0A0A", "font": "Geist", "logo_url": "https://..." } }
```

## Exemple SDK

```typescript
const { data } = await reponse.theme.get();
```
