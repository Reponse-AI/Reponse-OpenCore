---
title: "Tickets — List"
description: "Liste les tickets de support d'un client."
---

## Vue d'ensemble

Retourne les tickets de support pour un email client donné, optionnellement filtrés par statut. Le client est résolu en contact en interne.

## Authentification

Cet endpoint requiert un token Bearer. Incluez votre clé API workspace dans le header `Authorization`.

```
Authorization: Bearer <votre_cle_api>
```

## Requête

**GET** `/v1/tickets`

### Paramètres de requête

| Nom | Type | Requis | Description |
| --- | --- | --- | --- |
| `customer_email` | string | ✅ | Email du client. |
| `status` | string | ❌ | Filtre par statut de ticket. |


## Réponse

```json
{ "data": [ { "id": "ticket_uuid", "subject": "Where is my order?", "status": "open" } ] }
```

## Exemple SDK

```typescript
const { data } = await reponse.tickets.list({ query: { customer_email: "buyer@example.com" } });
```

## Erreurs

| Statut | Signification |
| --- | --- |
| `400` | `customer_email` requis. |
