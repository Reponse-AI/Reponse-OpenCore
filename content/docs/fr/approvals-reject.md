---
title: "Approvals — Reject"
description: "Rejette une approbation en attente."
---

## Vue d'ensemble

Refuse une action d'agent en attente pour qu'elle ne soit jamais exécutée. L'approbation doit être en attente.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/approvals/:approvalId/reject`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `approvalId` | string (uuid) | ✅ | L'ID de l'approbation. |


## Réponse

```json
{ "rejected": true, "approval": { "id": "appr_uuid", "status": "rejected" } }
```

## Exemple SDK

```typescript
await reponse.approvals.reject({ path: { approvalId } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | L'approbation n'est pas en attente. |
| `404` | Approbation introuvable. |
