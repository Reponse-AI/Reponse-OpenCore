---
title: "Rate Limits"
description: "Limites de débit de l'API et comment les gérer."
---

## Vue d'ensemble

L'API applique des limites de débit par workspace. En cas de dépassement, l'API répond `429 Too Many Requests`. Patientez et réessayez avec un délai exponentiel.

## Gérer le 429

Sur un `429`, attendez avant de réessayer et augmentez le délai à chaque tentative. Mettez en cache les réponses quand c'est possible pour réduire le volume de requêtes.
