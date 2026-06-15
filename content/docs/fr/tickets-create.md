---
title: "Tickets — Create"
description: "Crée un ticket de support."
---

## Vue d'ensemble

Ouvre un nouveau ticket de support pour un client. Le contact est créé automatiquement s'il n'existe pas déjà.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**POST** `/v1/tickets`

### Paramètres du corps

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `customer_email` | string | ✅ | Email du client. |
| `subject` | string | ✅ | Sujet du ticket. |
| `message` | string | ✅ | Corps du premier message. |
| `category` | string | ❌ | Catégorie du ticket. |
| `order_id` | string (uuid) | ❌ | Commande liée. |


## Réponse

```json
{ "data": { "id": "ticket_uuid", "status": "open" } }
```

## Exemple SDK

```typescript
await reponse.tickets.create({
  body: { customer_email: "buyer@example.com", subject: "Question", message: "Hello" }
});
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `customer_email`, `subject` et `message` requis. |
