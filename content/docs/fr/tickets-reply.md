---
title: "Tickets — Reply"
description: "Répond à un ticket de support."
---

## Vue d'ensemble

Ajoute un message à un fil de ticket existant. Le ticket doit appartenir au workspace authentifié.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/tickets/:id/reply`

### Paramètres de chemin

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | L'ID du ticket. |


### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `message` | string | ✅ | Corps de la réponse. |


## Réponse

```json
{ "data": { "id": "message_uuid", "ticket_id": "ticket_uuid" } }
```

## Exemple SDK

```typescript
await reponse.tickets.reply({ path: { id: ticketId }, body: { message: "Thanks for reaching out" } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `message` requis. |
| `404` | Ticket introuvable. |
