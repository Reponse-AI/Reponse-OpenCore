---
title: "React Hooks"
description: "Hooks React pour le data fetching avec SWR."
---

## Vue d'ensemble

`@reponseai/react` fournit des hooks basés sur SWR. Enveloppez votre app dans `ReponseProvider`, puis utilisez des hooks comme `useProducts` pour un data fetching déclaratif avec cache et revalidation.

## Configuration

```tsx
import { ReponseProvider } from '@reponseai/react';

<ReponseProvider apiKey="rp_live_...">
  <Shop />
</ReponseProvider>
```

## Récupérer les données

```tsx
import { useProducts } from '@reponseai/react';

const { data, error, isLoading } = useProducts({ limit: 20 });
```
