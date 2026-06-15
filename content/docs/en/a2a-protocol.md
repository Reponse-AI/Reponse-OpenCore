---
title: "A2A Protocol"
description: "Agent-to-agent (A2A) protocol support in Reponse."
---

## Overview

Reponse implements the **Agent-to-Agent (A2A)** protocol so external AI agents can discover, communicate with, and delegate tasks to the Reponse commerce agent in a structured, machine-readable way. A2A enables multi-agent orchestration without scraping UIs or building custom adapters — agents exchange JSON-RPC messages over HTTPS.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace with API key |
| A2A-compatible client | Any agent that speaks the A2A protocol |
| API key scope | `a2a:read`, `a2a:write` |

## Key concepts

| Concept | Description |
|---|---|
| **Agent Card** | A JSON document describing the agent's identity, capabilities, and endpoint |
| **Task** | A unit of work with lifecycle states (`submitted → working → completed`) |
| **Message** | A structured message exchanged between agents within a task |
| **Artifact** | A typed output produced by a task (e.g. a cart summary, product list) |

## Step 1 — Discover the agent card

Every Reponse workspace exposes an agent card at a well-known URL:

```
GET https://api.reponse.ai/v1/a2a/.well-known/agent.json
Authorization: Bearer rp_live_xxxxxxxxxxxx
```

**Response:**

```json
{
  "name": "Reponse Commerce Agent",
  "description": "AI commerce agent for product discovery, cart management, and order support",
  "url": "https://api.reponse.ai/v1/a2a",
  "version": "1.0.0",
  "capabilities": {
    "streaming": false,
    "pushNotifications": false
  },
  "skills": [
    {
      "id": "product-search",
      "name": "Product Search",
      "description": "Search the product catalog with natural language"
    },
    {
      "id": "cart-management",
      "name": "Cart Management",
      "description": "Create, update, and check out shopping carts"
    },
    {
      "id": "order-lookup",
      "name": "Order Lookup",
      "description": "Look up order status and history by email"
    }
  ],
  "authentication": {
    "schemes": ["bearer"]
  }
}
```

## Step 2 — Send a task

Tasks are submitted via JSON-RPC 2.0:

```bash
curl -X POST https://api.reponse.ai/v1/a2a \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer rp_live_xxxxxxxxxxxx" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tasks/send",
    "id": "req-001",
    "params": {
      "id": "task-abc-123",
      "message": {
        "role": "user",
        "parts": [
          { "type": "text", "text": "Find me wireless headphones under $50" }
        ]
      }
    }
  }'
```

## Step 3 — Receive the response

```json
{
  "jsonrpc": "2.0",
  "id": "req-001",
  "result": {
    "id": "task-abc-123",
    "status": { "state": "completed" },
    "artifacts": [
      {
        "name": "product-results",
        "parts": [
          {
            "type": "text",
            "text": "Found 3 wireless headphones under $50..."
          },
          {
            "type": "data",
            "data": {
              "products": [
                { "id": "prod_1", "name": "BassX Pro", "price": 39.99 },
                { "id": "prod_2", "name": "SoundWave Lite", "price": 29.99 }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

## Task lifecycle

```
submitted → working → completed
                   ↘ failed
                   ↘ canceled
```

| State | Description |
|---|---|
| `submitted` | Task received, queued for processing |
| `working` | Agent is actively processing the task |
| `completed` | Task finished successfully with artifacts |
| `failed` | Task encountered an error |
| `canceled` | Task was canceled by the caller |

## JSON-RPC methods

| Method | Description |
|---|---|
| `tasks/send` | Submit a new task or append a message to an existing task |
| `tasks/get` | Retrieve a task by ID with its current status and artifacts |
| `tasks/cancel` | Cancel a running task |

## TypeScript example

```typescript
const response = await fetch('https://api.reponse.ai/v1/a2a', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REPONSE_API_KEY}`,
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'tasks/send',
    id: 'req-002',
    params: {
      id: crypto.randomUUID(),
      message: {
        role: 'user',
        parts: [{ type: 'text', text: 'What is the status of order #12345?' }],
      },
    },
  }),
});

const { result } = await response.json();
console.log(result.status.state);    // "completed"
console.log(result.artifacts);       // task outputs
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| 404 on agent card URL | A2A not enabled for workspace | Contact support to enable A2A |
| `UNAUTHORIZED` on task send | Missing or invalid bearer token | Verify API key and `a2a:write` scope |
| Task stays in `working` | Complex query taking longer | Poll `tasks/get` or increase timeout |
| Empty artifacts | No matching products or data | Refine the query or check catalog data |
| JSON-RPC parse error | Malformed request body | Validate JSON structure matches spec |
