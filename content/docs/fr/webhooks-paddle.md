---
title: "Paddle Webhooks"
description: "Webhooks de facturation Paddle."
---

## Vue d'ensemble

Les webhooks Paddle gèrent les événements de facturation d'abonnement pour les workspaces utilisant Paddle comme marchand de référence.

## Événements

Les événements de cycle de vie d'abonnement (créé, mis à jour, paiement réussi, annulé) gardent l'état de facturation aligné.

## Livraison et retries

Les webhooks sont livrés en requêtes HTTP POST avec un corps JSON. Répondez `2xx` pour accuser réception. Les livraisons échouées sont réessayées avec backoff, donc rendez votre handler idempotent.
