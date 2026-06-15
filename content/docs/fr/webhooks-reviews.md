---
title: "Reviews (Stamped / Trustpilot)"
description: "Webhooks d'avis produit."
---

## Vue d'ensemble

Les webhooks d'avis notifient Reponse quand des avis sont créés ou mis à jour, alimentant les notes agrégées dans les données structurées produit.

## Événements

Les événements d'avis créé et mis à jour mettent à jour la note agrégée du produit utilisée dans le JSON-LD.

## Livraison et retries

Les webhooks sont livrés en requêtes HTTP POST avec un corps JSON. Répondez `2xx` pour accuser réception. Les livraisons échouées sont réessayées avec backoff, donc rendez votre handler idempotent.
