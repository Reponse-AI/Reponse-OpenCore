---
title: "Subscriptions — Manage"
description: "Modifie un abonnement (reporter ou expédier maintenant)."
---

## Vue d'ensemble

Met à jour un abonnement actif. Utilisez `delay` avec une `target_date` future pour repousser la prochaine livraison, ou `ship_now` pour déclencher la prochaine commande immédiatement. Seuls les abonnements actifs peuvent être modifiés.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**PATCH** `/v1/subscriptions/:id`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | L'ID de l'abonnement. |


### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `action` | string | ✅ | `delay` ou `ship_now`. |
| `target_date` | string (ISO) | ❌ | Requis pour `delay`; doit être après la fin de période actuelle. |


## Réponse

```json
{ "success": true }
```

## Exemple SDK

```typescript
await reponse.subscriptions.update({ path: { id }, body: { action: "delay", target_date: "2026-07-01" } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | Action invalide, `target_date` manquante/invalide, ou abonnement non actif. |
| `404` | Abonnement introuvable. |
