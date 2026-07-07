---
title: "Storefront Headless"
description: "Déployez un storefront headless complet propulsé par Reponse avec Next.js 16."
---

## Aperçu

Reponse fournit un **starter Next.js 16 prêt à l'emploi** (`starters/nextjs-storefront/`) qui se connecte à votre workspace via l'API Headless. Il inclut 12 pages, l'authentification B2C et un thème dynamique — le tout configurable depuis le dashboard Reponse.

## Prérequis

| Prérequis | Description |
|---|---|
| Workspace Reponse | Workspace actif avec des produits |
| Node.js 18+ | Requis pour Next.js 16 |
| Variables d'environnement | `REPONSE_API_URL`, `REPONSE_WORKSPACE_ID` |

## Démarrage rapide

```bash
cp -r starters/nextjs-storefront mon-store
cd mon-store
cp .env.example .env.local
# Configurez REPONSE_API_URL et REPONSE_WORKSPACE_ID
pnpm install && pnpm dev
```

## Pages

| Route | Description | Module requis |
|---|---|---|
| `/` | Page d'accueil avec produits vedettes | — |
| `/products` | Catalogue avec recherche (`?q=`) et pagination par curseur | — |
| `/products/[slug]` | Fiche produit avec variantes, avis et facts | — |
| `/collections` | Liste des collections | — |
| `/cart` | Panier | — |
| `/reviews` | Avis clients du store | `reviews` |
| `/rewards` | Page marketing programme fidélité | `loyalty` |
| `/track` | Suivi de commande public (email + n° de commande) | — |
| `/support` | Formulaire de ticket support | `support` |
| `/account/login` | Connexion B2C par OTP email | — |
| `/feed` | Flux produits pour agents IA | — |
| `/acp` | Agentic Commerce Protocol | — |

## Endpoints API

### Nouveaux endpoints

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| `GET` | `/v1/products/{id}/reviews` | Storefront | Avis produit avec agrégats |
| `GET` | `/v1/reviews` | Storefront | Avis du store |
| `POST` | `/v1/reviews` | Storefront | Soumettre un avis (modération auto) |
| `GET` | `/v1/me` | Bearer (session) | Profil du contact authentifié |
| `GET` | `/v1/orders` | Storefront + `contact_id` | Historique de commandes |
| `GET` | `/v1/orders/lookup` | Storefront | Recherche par email + n° de commande |

### Endpoints enrichis

| Méthode | Chemin | Changement |
|---|---|---|
| `GET` | `/v1/theme` | Ajout du bloc `modules` depuis `workspace_modules` |
| `GET` | `/v1/loyalty` | Config publique sans API key (quand pas de `contact_id`) |
| `GET` | `/v1/products/{id}` | `?include=facts` pour les Q&R produit |

## Thème

Le storefront lit les CSS custom properties depuis `GET /v1/theme` :

```css
--rp-color-primary
--rp-color-background
--rp-color-surface
--rp-color-border
--rp-color-text
--rp-color-text-secondary
--rp-radius
--rp-font-family
--rp-brand-name
--rp-brand-logo
```

Configurez-les dans **Dashboard → Paramètres → Widget**.

## Gestion des modules

Les pages `/reviews`, `/rewards` et `/support` sont affichées conditionnellement selon l'activation des modules du workspace. La réponse `/v1/theme` inclut un bloc `modules` :

```json
{
  "modules": {
    "reviews": { "active": true, "config": {} },
    "loyalty": { "active": true, "config": {} },
    "support": { "active": false, "config": {} }
  }
}
```

Utilisez `isModuleActive(config, "reviews")` dans le starter pour conditionner les pages.

## Authentification B2C

Le storefront utilise l'authentification par OTP (mot de passe à usage unique) par email :

1. **Demande OTP** : `POST /api/auth/b2c/otp` avec `{ workspaceId, email }`
2. **Vérification** : `POST /api/auth/b2c/verify` avec `{ workspaceId, email, code }`
3. **Session** : La réponse inclut un `sessionToken` stocké dans un cookie httpOnly
4. **Appels authentifiés** : `GET /v1/me` avec `Authorization: Bearer <sessionToken>`

Les tokens de session expirent après 30 jours.

## Sécurité

- **Protection IDOR** : Le lookup de commande échappe les wildcards SQL (`%`, `_`) dans l'email
- **Double auth sur loyalty** : Config publique via storefront auth ; solde via API key
- **Isolation par session** : `/v1/me` résout le contact depuis le hash du token — pas de `contact_id` exposé côté client
- **Rate limiting** : Tous les endpoints publics utilisent `checkStorefrontRateLimit`
