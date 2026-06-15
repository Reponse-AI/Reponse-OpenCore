---
title: "Approvals — Execute"
description: "Exécute une approbation en attente (action human-in-the-loop)."
---

## Vue d'ensemble

Approuve et exécute une action d'agent en attente (par exemple émettre un remboursement ou annuler une commande). L'approbation doit être en attente.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/approvals/:approvalId/execute`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `approvalId` | string (uuid) | ✅ | L'ID de l'approbation. |


## Réponse

```json
{ "executed": true, "approval": { "id": "appr_uuid", "status": "executed" } }
```

## Exemple SDK

```typescript
await reponse.approvals.execute({ path: { approvalId } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | L'approbation n'est pas en attente. |
| `404` | Approbation introuvable. |
