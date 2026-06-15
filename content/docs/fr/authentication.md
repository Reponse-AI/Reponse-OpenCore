---
title: "Authentication"
description: "Comment s'authentifier auprès de l'API Reponse."
---

## Vue d'ensemble

L'API utilise l'authentification Bearer. Chaque requête doit inclure votre clé API workspace dans le header `Authorization`. Les clés sont liées à un seul workspace.

## Format du header

Passez la clé en token Bearer :

```
Authorization: Bearer <votre_cle_api>
```

## Types de clés

Les clés de test sont préfixées `rp_test_` et opèrent sur des données de test. Les clés live sont préfixées `rp_live_`. Créez et faites tourner les clés dans le dashboard, section Réglages, clés API.

## Sécurité

N'exposez jamais une clé live dans du code client. Utilisez-la depuis un serveur ou relayez les requêtes via votre backend.
