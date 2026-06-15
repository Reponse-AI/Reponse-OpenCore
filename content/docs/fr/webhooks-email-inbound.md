---
title: "Email Inbound"
description: "Webhooks d'email entrant pour le support."
---

## Vue d'ensemble

Les webhooks d'email entrant transforment les réponses clients en messages de ticket support, pour garder les conversations email regroupées dans Reponse.

## Événements

Un email entrant correspond à une réponse de ticket sur le fil concerné, créant le ticket si nécessaire.

## Livraison et retries

Les webhooks sont livrés en requêtes HTTP POST avec un corps JSON. Répondez `2xx` pour accuser réception. Les livraisons échouées sont réessayées avec backoff, donc rendez votre handler idempotent.
