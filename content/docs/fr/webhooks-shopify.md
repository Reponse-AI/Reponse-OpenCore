---
title: "Shopify Webhooks"
description: "Webhooks de synchronisation Shopify."
---

## Vue d'ensemble

Les webhooks Shopify pilotent la synchronisation du catalogue. Sur les événements produit, Reponse upserte produits, variantes et images indexés sur l'ID produit Shopify.

## Événements

Les événements gérés incluent `products/create`, `products/update`, `products/delete`, ainsi que les mises à jour de collections et de stock.

## Livraison et retries

Les webhooks sont livrés en requêtes HTTP POST avec un corps JSON. Répondez `2xx` pour accuser réception. Les livraisons échouées sont réessayées avec backoff, donc rendez votre handler idempotent.
