---
title: "Architecture"
description: "How the Reponse platform is structured."
---

## Overview

Reponse is built on a Next.js application backed by Supabase (Postgres). The REST API under `/v1` is the single integration surface; the TypeScript SDK is generated from the same OpenAPI specification, so the SDK and the API never drift apart.

## Platform Architecture

```mermaid
graph TD
    subgraph Clients
        A[TypeScript SDK] 
        B[React Hooks]
        C[MCP Server]
        D[Storefront Starter]
    end

    subgraph API Layer
        E["/v1 REST API"]
        F["AI Activation Layer"]
    end

    subgraph Core
        G["Supabase (Postgres)"]
        H["Auth & Workspace Scoping"]
    end

    subgraph External
        I[Shopify]
        J[Stripe / Paddle]
        K[Klaviyo]
        L[Logistics Providers]
    end

    A -->|HTTP| E
    B -->|HTTP| E
    C -->|Tools| E
    D -->|HTTP| E
    F -->|Orchestrates| E
    E -->|Read/Write| G
    E -->|Validates| H
    H -->|Scopes| G
    I -->|Webhooks| E
    J -->|Webhooks| E
    K -->|Events| E
    L -->|Webhooks| E
```

## Layers

Data lives in Supabase. The `/v1` API exposes it with workspace-scoped authentication. The SDK and React hooks wrap the API. The AI activation layer and MCP server sit on top.

| Layer | Role | Examples |
| --- | --- | --- |
| **Data** | Postgres via Supabase | Products, orders, carts, conversations |
| **API** | REST endpoints under `/v1` | `GET /v1/products`, `POST /v1/carts` |
| **SDK** | TypeScript client + React hooks | `@reponse/sdk`, `useProducts()` |
| **AI** | Activation layer + MCP server | Engine selection, intent classification |
| **Integrations** | External service sync | Shopify, Stripe, Klaviyo, logistics |

## Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as /v1 API
    participant Auth as Auth Layer
    participant DB as Supabase

    Client->>API: Request + Bearer API key
    API->>Auth: Validate key
    Auth-->>API: Workspace ID
    API->>DB: Query (scoped to workspace)
    DB-->>API: Data
    API-->>Client: JSON response
```

## Multi-tenancy

Every resource is scoped to a workspace. Your API key determines the workspace, and the API enforces it on every query. There is no cross-workspace data access — isolation is enforced at the database level.
