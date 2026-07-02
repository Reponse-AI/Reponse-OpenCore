---
title: "Storefront Starter"
description: "Le starter de storefront Next.js."
---

## Vue d'ensemble

Le **Reponse Storefront Starter** est un frontend commerce Next.js prêt pour la production, connecté au SDK Reponse. Il inclut le listing produits, la fiche produit, les collections, le panier, le checkout embarqué, le sitemap, robots.txt et le JSON-LD produit — tout ce qu'il faut pour lancer un storefront headless en quelques minutes.

## Prérequis

| Requis | Version minimale |
|---|---|
| Node.js | 18+ |
| pnpm (ou npm / yarn) | 9+ |
| Workspace Reponse | Actif, avec au moins un produit |
| Clé API Reponse | Générée dans **Dashboard → Paramètres → Clés API** |
| Compte Stripe | Connecté à votre workspace (pour le checkout) |

## Étape 1 — Cloner le starter

```bash
npx degit reponseai/storefront-starter my-store
cd my-store
pnpm install
```

## Étape 2 — Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# ─── API Reponse (requis) ───────────────────────────────────────────────────
REPONSE_API_KEY=rp_live_xxxxxxxxxxxx
NEXT_PUBLIC_REPONSE_API_URL=https://reponse.ai/api
NEXT_PUBLIC_REPONSE_API_KEY=rp_live_xxxxxxxxxxxx
NEXT_PUBLIC_WORKSPACE_ID=votre-workspace-uuid

# ─── Store ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_STORE_NAME="Ma Boutique"
NEXT_PUBLIC_SITE_URL=https://ma-boutique.com

# ─── Checkout ───────────────────────────────────────────────────────────────
CHECKOUT_MODE=embedded
NEXT_PUBLIC_MARKET_ID=votre-market-uuid
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
```

### Référence des variables

| Variable | Requis | Description |
|---|---|---|
| `REPONSE_API_KEY` | Oui | Clé API côté serveur. Voir [Authentification](doc:authentication). |
| `NEXT_PUBLIC_REPONSE_API_URL` | Oui | URL de base de l'API — utilisez `https://reponse.ai/api` en production. |
| `NEXT_PUBLIC_REPONSE_API_KEY` | Oui | Clé API côté client (même valeur que `REPONSE_API_KEY`). Utilisée pour les opérations panier et variantes côté navigateur. |
| `NEXT_PUBLIC_WORKSPACE_ID` | Oui | UUID de votre workspace. Voir [Trouver votre Workspace ID](#trouver-votre-workspace-id). |
| `NEXT_PUBLIC_STORE_NAME` | Oui | Nom du store affiché dans le header et le footer. |
| `NEXT_PUBLIC_SITE_URL` | Non | URL canonique pour le SEO (par défaut `localhost:3000`). |
| `CHECKOUT_MODE` | Non | `embedded` (Stripe Elements sur votre site) ou `redirect` (redirection vers Stripe Checkout). Par défaut `embedded`. Voir [Modes de checkout](#modes-de-checkout). |
| `NEXT_PUBLIC_MARKET_ID` | Oui | UUID du marché pour la devise, les taxes et la livraison. Voir [Trouver votre Market ID](#trouver-votre-market-id). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Oui | Clé publique Stripe. Voir [Trouver votre clé Stripe](#trouver-votre-clé-stripe). |

### Trouver votre Workspace ID

1. Ouvrez le dashboard Reponse.
2. Le workspace ID est l'UUID dans l'URL : `https://reponse.ai/dashboard/{workspace-id}/...`
3. Vous pouvez aussi le trouver dans **Paramètres → Général**.

### Trouver votre Market ID

Les marchés définissent la devise, les règles fiscales et les zones de livraison d'une région. Chaque workspace possède au moins un marché (créé automatiquement).

1. Allez dans **Dashboard → Paramètres → Marchés**.
2. Cliquez sur le marché souhaité (ex. « France » ou « Europe »).
3. Copiez le **Market ID** affiché en haut de la page de détail du marché.

Si vous vendez dans un seul pays, utilisez votre marché par défaut. Pour un storefront multi-devises, passez différentes valeurs `market_id` selon la locale du visiteur.

### Trouver votre clé Stripe

Le storefront nécessite votre clé Stripe **publique** (commence par `pk_live_` ou `pk_test_`). C'est une clé côté client — elle peut être exposée dans le navigateur en toute sécurité.

1. Allez sur [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
2. Copiez la **Clé publiable** (Publishable key).
3. Pour les tests, utilisez la clé du mode test Stripe (`pk_test_...`).

> **Note :** Votre workspace nécessite également une clé Stripe **secrète** configurée côté backend. Elle se configure dans **Dashboard → Paramètres → Paiements** — vous n'avez pas besoin de l'ajouter au `.env.local` de votre storefront.

### Modes de checkout

| Mode | Description |
|---|---|
| `embedded` (par défaut) | Stripe Payment Elements s'affichent directement sur votre storefront. Le client ne quitte jamais votre site. Nécessite `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. |
| `redirect` | Le client est redirigé vers une page de checkout hébergée par Stripe. Plus simple à configurer — pas besoin de clé Stripe dans le storefront. |

## Étape 3 — Lancer en local

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Les produits de votre workspace Reponse apparaissent automatiquement.

## Étape 4 — Déployer

### Vercel

```bash
pnpm build          # vérifier le build de production en local
vercel --prod       # déployer
```

Configurez les mêmes variables d'environnement dans le dashboard Vercel sous **Settings → Environment Variables**.

### Netlify

Le starter inclut un fichier de configuration `netlify.toml`. Pour déployer :

1. Créez un nouveau site sur Netlify et connectez votre dépôt Git.
2. Netlify détecte automatiquement le framework Next.js et utilise l'adaptateur `@netlify/plugin-nextjs`.
3. Configurez les variables d'environnement dans **Site Settings → Environment Variables**.
4. Déployez.

## Étape 5 — Ajouter le widget AI Chat (optionnel)

Ajoutez le widget chat Reponse à votre storefront pour le commerce conversationnel. Le starter l'inclut automatiquement quand `NEXT_PUBLIC_WORKSPACE_ID` est défini.

Pour l'ajouter manuellement dans un layout personnalisé :

```tsx
import Script from "next/script";

<Script
  src="https://reponse.ai/assets/sdk/reponse-widget.min.js"
  data-workspace-id={process.env.NEXT_PUBLIC_WORKSPACE_ID}
  strategy="lazyOnload"
/>
```

## Dépannage

| Symptôme | Cause | Solution |
|---|---|---|
| Liste de produits vide | `REPONSE_API_KEY` invalide ou manquante | Vérifiez la clé dans Dashboard → Paramètres → Clés API |
| Erreur 401 sur les appels API | La clé n'a pas le scope `catalog:read` | Regénérez la clé avec les scopes requis |
| Échec du build avec erreurs de type | Version SDK obsolète | Exécutez `pnpm update @reponseai/sdk` |
| Checkout échoue | `NEXT_PUBLIC_MARKET_ID` manquant ou Stripe non connecté | Vérifiez le market ID et la config Stripe dans le dashboard |

## Voir aussi

- [Authentification](doc:authentication)
- [Checkout — Stripe](doc:checkout-stripe)
- [Checkout — Payment Intent](doc:checkout-intent)
- [SDK Overview](doc:sdk-overview)
- [Variables d'environnement](doc:environment-variables)
