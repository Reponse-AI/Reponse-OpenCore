---
title: "First Request"
description: "Faites votre premier appel à l'API Reponse en moins de cinq minutes."
---

## Vue d'ensemble

Ce quickstart vous mène d'une clé API à une requête catalogue réussie. Vous allez installer le SDK, initialiser le client et lister des produits.

## 1. Installer le SDK

```bash
npm install @reponseai/sdk
```

## 2. Initialiser le client

```typescript
import { Reponse } from '@reponseai/sdk';

const reponse = new Reponse({ apiKey: process.env.REPONSE_API_KEY });
```

## 3. Lister les produits

```typescript
const { data } = await reponse.catalog.listProducts({ query: { limit: 10 } });
console.log(data.data);
```
