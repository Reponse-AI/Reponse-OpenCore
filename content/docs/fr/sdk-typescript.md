---
title: "TypeScript SDK"
description: "Le SDK TypeScript officiel."
---

## Vue d'ensemble

`@reponseai/sdk` est un client typé pour toute l'API commerce. Il expose des opérations namespacées comme `reponse.catalog`, `reponse.cart`, `reponse.orders`, `reponse.loyalty` et `reponse.tickets`.

## Installation et init

```typescript
import { Reponse } from '@reponseai/sdk';

const reponse = new Reponse({ apiKey: process.env.REPONSE_API_KEY });
```

## Appeler les opérations

Chaque opération prend un objet typé avec `path`, `query` et `body` selon les besoins :

```typescript
const { data } = await reponse.catalog.listProducts({ query: { limit: 10 } });
const { data: cart } = await reponse.cart.get({ path: { id: cartId } });
```
