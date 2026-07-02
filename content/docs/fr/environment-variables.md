---
title: "Variables d'environnement"
description: "Variables d'environnement utilisées par le SDK Reponse et les storefronts."
---

## Vue d'ensemble

Configurez ces variables dans votre environnement d'hébergement. Ne committez jamais de secrets dans le dépôt — utilisez `.env.local` ou le gestionnaire de secrets de votre hébergeur.

## Variables principales

| Variable | Description |
| --- | --- |
| `REPONSE_API_KEY` | Votre clé API workspace (côté serveur). |
| `NEXT_PUBLIC_REPONSE_BASE_URL` | Surcharge optionnelle de l'URL de base. |

## Storefront

Ces variables sont spécifiques aux storefronts construits avec le [Storefront Starter](doc:storefront-starter) ou le SDK Reponse.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_REPONSE_API_URL` | URL de base de l'API (ex. `https://reponse.ai/api`). |
| `NEXT_PUBLIC_REPONSE_API_KEY` | Clé API côté client (même valeur que `REPONSE_API_KEY`). Utilisée pour les opérations panier et variantes côté navigateur. |
| `NEXT_PUBLIC_WORKSPACE_ID` | UUID du workspace. Visible dans l'URL du dashboard ou dans **Paramètres → Général**. |
| `NEXT_PUBLIC_STORE_NAME` | Nom du store affiché dans le header et le footer. |
| `NEXT_PUBLIC_SITE_URL` | URL canonique du site pour le SEO (ex. `https://ma-boutique.com`). |
| `NEXT_PUBLIC_MARKET_ID` | UUID du marché pour la devise, les taxes et la livraison. Disponible dans **Dashboard → Paramètres → Marchés**. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe (`pk_live_` ou `pk_test_`). Disponible dans le [Dashboard Stripe → Clés API](https://dashboard.stripe.com/apikeys). |
| `CHECKOUT_MODE` | Mode de checkout : `embedded` (Stripe Elements sur votre site) ou `redirect` (page Stripe hébergée). Par défaut `embedded`. |
