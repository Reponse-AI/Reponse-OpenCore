---
title: "Stripe Webhooks"
description: "Webhooks de paiement Stripe."
---

## Vue d'ensemble

Les webhooks Stripe gardent l'état des commandes et paiements synchronisé. Reponse vérifie la signature Stripe avant traitement.

## Événements

Les événements clés incluent `payment_intent.succeeded`, `payment_intent.payment_failed` et `charge.refunded`, qui pilotent la confirmation de commande et l'état des remboursements.

## Livraison et retries

Les webhooks sont livrés en requêtes HTTP POST avec un corps JSON. Répondez `2xx` pour accuser réception. Les livraisons échouées sont réessayées avec backoff, donc rendez votre handler idempotent.
