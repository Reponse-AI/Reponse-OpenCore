---
title: "Events Reference"
description: "Référence des types d'événements webhook."
---

## Vue d'ensemble

Reponse émet des événements sur les domaines commerce et support. Abonnez-vous à ceux pertinents pour votre intégration.

## Événements

Les familles d'événements courantes incluent les événements commande (créée, payée, expédiée, annulée, remboursée), les événements catalogue (mises à jour produit et stock), les événements d'avis et les événements de tickets support.

## Livraison et retries

Les webhooks sont livrés en requêtes HTTP POST avec un corps JSON. Répondez `2xx` pour accuser réception. Les livraisons échouées sont réessayées avec backoff, donc rendez votre handler idempotent.
