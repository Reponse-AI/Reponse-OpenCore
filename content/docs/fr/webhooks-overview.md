---
title: "Webhooks Overview"
description: "Comment fonctionnent les webhooks Reponse."
---

## Vue d'ensemble

Les webhooks notifient vos systèmes quand des événements surviennent dans Reponse (commandes, paiements, changements catalogue, avis, support). Chaque source d'intégration a son propre endpoint webhook et son jeu d'événements.

## Sécurité

Vérifiez les signatures de webhook quand le fournisseur les fournit (Stripe, Shopify) avant de faire confiance au payload. Validez toujours que l'événement appartient à votre workspace.

## Idempotence

Les fournisseurs peuvent livrer le même événement plusieurs fois. Indexez votre traitement sur l'ID d'événement pour que les retries soient sûrs.
