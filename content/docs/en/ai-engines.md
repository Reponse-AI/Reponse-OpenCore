---
title: "AI Engines"
description: "The AI engines that power Reponse activation."
---

## Overview

Reponse AI engines define the personality, sales funnel strategy, and response style of your chat assistant. Each engine is optimized for a specific traffic type and buyer mindset. The dispatcher selects the right engine automatically based on UTM parameters, or you can force one explicitly.

## Prerequisites

- A Reponse workspace with products synced
- At least one published campaign

## Engine Profiles

Reponse ships with three engine families, available in both French (`fr-`) and English (`en-`) locales:

| Engine | Audience | Tone | Best For |
| --- | --- | --- | --- |
| `core-std-v1` | Organic / direct visitors | Warm, consultative | Default engagement, brand storytelling |
| `ecom-expert-v1` | Search / high-intent users | Data-driven, ROI-focused | Technical buyers, comparison shoppers |
| `ecom-turbo-v1` | Social / paid traffic | Energetic, urgency-driven | Impulse buys, flash sales, social ads |

Each engine folder contains two files:
- **`sales-funnel.ts`** — Defines the conversion funnel stages and transition rules.
- **`style.ts`** — Sets the tone, vocabulary, and formatting constraints.

Shared behaviors (identity, safety, RAG protocol) live in `engines/shared/`.

## Naming Convention

Engines follow the pattern: `[LANG]-[FAMILY]-[PROFILE]-[VERSION]`

```
fr-ecom-turbo-v1
│   │     │     │
│   │     │     └─ Version
│   │     └─────── Profile (std, expert, turbo)
│   └───────────── Family (core, ecom)
└───────────────── Language (fr, en)
```

## UTM-Based Dispatch

The dispatcher (`engines/dispatcher.ts`) automatically routes visitors to the best engine based on their UTM parameters:

| UTM Signal | Engine Selected |
| --- | --- |
| `utm_medium=search` | `ecom-expert-v1` |
| `utm_campaign` contains `roi`, `expert`, `tech` | `ecom-expert-v1` |
| `utm_content` contains `technique`, `data` | `ecom-expert-v1` |
| `utm_source` is `facebook`, `instagram`, `tiktok` | `ecom-turbo-v1` |
| `utm_medium=social` or `paidsocial` | `ecom-turbo-v1` |
| `utm_campaign` contains `promo`, `flash`, `turbo` | `ecom-turbo-v1` |
| No UTM or unmatched | `core-std-v1` (default) |

The intent classifier can further override the engine mid-conversation if the user's messages signal a different buying intent.

## What Engines Are Grounded On

All engines share the same knowledge base per workspace:

- **Product catalog** — titles, descriptions, prices, variants
- **Product facts** — curated selling points and specifications
- **Vision analyses** — AI-generated insights from product images
- **RAG documents** — vector-matched knowledge sources
- **Workspace policies** — commercial policy, marketing policy, brand voice

## Forcing an Engine

You can bypass the dispatcher by passing an `engine` field in the chat API request body:

```bash
curl -X POST "https://api.reponse.ai/v1/chat" \
  -H "Authorization: Bearer rp_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "ws_01H...",
    "message": "Compare these two products",
    "engine": "en-ecom-expert-v1"
  }'
```

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Wrong engine selected | Check the UTM params in the page URL. The dispatcher logs the selected engine. |
| Engine responses feel generic | Ensure product facts and knowledge sources are populated for your workspace. |
| English visitors get French engine | Verify the `locale` is set to `en` in your campaign or widget configuration. |
| Intent override unexpected | The intent classifier may switch engines mid-conversation. Review the conversation logs. |
