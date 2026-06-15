---
title: "Logistics"
description: "Webhooks logistique et livraison."
---

## Vue d'ensemble

Les webhooks logistique mettent à jour l'état d'expédition et de suivi à mesure que les transporteurs font avancer un colis.

## Événements

Les mises à jour de statut d'expédition (en transit, livré, incident) gardent l'expédition à jour et peuvent déclencher des notifications client.

## Livraison et retries

Les webhooks sont livrés en requêtes HTTP POST avec un corps JSON. Répondez `2xx` pour accuser réception. Les livraisons échouées sont réessayées avec backoff, donc rendez votre handler idempotent.
