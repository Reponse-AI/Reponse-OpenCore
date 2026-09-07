---
title: "Métachamps et bloc Reponse dans Shopify Admin"
description: "Retrouvez la fidélité, les tickets, les avis et le parrainage de chaque client directement dans votre admin Shopify."
---

## Vue d'ensemble

Une fois l'application Reponse installée depuis l'App Store, chaque fiche client de votre admin Shopify affiche ce que Reponse sait de ce client : son solde de points et son palier de fidélité, ses tickets ouverts, ses avis et son activité de parrainage. Ces données arrivent sous deux formes :

- **Des métachamps et des tags** sur le client Shopify, que vous pouvez utiliser dans vos segments et dans Shopify Flow.
- **Un bloc Reponse** rendu par Shopify dans la fiche client, sous les cartes natives, avec des liens vers le dashboard Reponse.

Il n'y a rien à construire ni à configurer côté thème. Tout est inclus dans le plan gratuit, comme le reste de la suite.

## Ce qui apparaît dans Shopify

### Les neuf métachamps

Les métachamps sont écrits dans l'espace de noms réservé à l'application. Dans l'admin, il apparaît sous la forme `app--{app-id}--reponse`, où `{app-id}` est l'identifiant numérique de l'application Reponse attribué par Shopify. Seule l'application peut y écrire ; vous pouvez les lire, les filtrer et les afficher, mais pas les modifier à la main.

| Clé | Type | Signification |
|---|---|---|
| `loyalty_points` | Nombre entier | Solde de points de fidélité actuel |
| `loyalty_tier` | Texte | Nom du palier de fidélité actuel (par exemple « Gold ») |
| `reviews_count` | Nombre entier | Nombre d'avis publiés rédigés par ce client |
| `reviews_avg_rating` | Nombre décimal | Note moyenne de ses avis publiés |
| `open_tickets` | Nombre entier | Tickets de support ouverts ou en attente d'une réponse du client |
| `last_ticket_at` | Date et heure | Date de création de son dernier ticket |
| `referrals_count` | Nombre entier | Filleuls qui ont passé commande grâce à ce client |
| `referral_code` | Texte | Son code de parrainage |
| `contact_url` | URL | Lien vers sa fiche dans le dashboard Reponse |

Les huit premiers sont de types filtrables dans la segmentation Shopify (nombre, texte, date). `contact_url` est un lien : il ne sert pas aux segments, c'est voulu.

Un champ vide n'est jamais écrasé par une valeur nulle. Si un client n'a ni points, ni ticket, ni avis, ses métachamps restent absents de la fiche plutôt que d'afficher des zéros.

### Les deux tags

Pour les marchands qui segmentent par tag plutôt que par métachamp, Reponse pose aussi deux tags sur le client :

- `reponse:tier:{palier}`, par exemple `reponse:tier:gold`. Un seul tag de palier à la fois : quand le client change de palier, l'ancien tag est retiré.
- `reponse:ticket-open`, présent tant qu'au moins un ticket est ouvert, retiré dès que tout est résolu.

Vos autres tags ne sont jamais touchés. Reponse n'ajoute et ne retire que les tags qui commencent par `reponse:`.

### Le bloc Reponse dans la fiche client

Sous les cartes natives de la fiche client, Shopify affiche un bloc Reponse avec quatre sections, dans cet ordre :

1. **Fidélité** : solde de points et palier.
2. **Tickets** : les tickets ouverts avec leur statut.
3. **Avis** : note moyenne et derniers avis publiés.
4. **Parrainage** : code de parrainage et nombre de filleuls convertis.

Chaque section propose un lien qui ouvre la fiche correspondante dans le dashboard Reponse, dans un nouvel onglet. Le bloc est traduit en français et en anglais selon la langue de l'utilisateur connecté à l'admin.

Quand Reponse ne connaît pas encore ce client (aucune conversation, aucun ticket, aucun avis), le bloc l'indique simplement. Si une erreur réseau survient, un bouton « Réessayer » est proposé.

## Connecter votre boutique

### 1. Installer l'application

Installez l'application Reponse depuis l'App Store : [apps.shopify.com/reponse](https://apps.shopify.com/reponse). Shopify vous demande d'accepter les permissions listées plus bas, puis ouvre l'application dans votre admin.

### 2. Créer une clé API dans Reponse

Dans le dashboard Reponse, ouvrez [Réglages › Clés API](app:dashboard_settings) et créez une clé de type **Reponse** avec au minimum ces trois scopes :

| Scope | Utilité |
|---|---|
| `read:customers` | Retrouver le contact Reponse qui correspond au client Shopify |
| `read:conversations` | Alimenter le bloc de la fiche client |
| `write:integrations` | Enregistrer le lien entre votre boutique et votre workspace |

Copiez la clé au moment de sa création : elle n'est affichée qu'une fois.

### 3. Coller la clé dans l'application

Dans l'application Reponse ouverte depuis votre admin Shopify, collez la clé dans les réglages et enregistrez. L'application transmet alors le domaine de votre boutique à Reponse, qui affiche la boutique comme connectée dans [Réglages › Intégrations](app:dashboard_integrations). Aucune saisie de token n'est nécessaire.

Si la clé est révoquée par la suite, l'application le signale et vous demande d'en saisir une nouvelle.

### Permissions Shopify demandées

À l'installation, Shopify vous présente la liste des permissions de l'application. Voici pourquoi chacune est demandée :

| Permission | Utilité |
|---|---|
| `read_customers`, `write_customers` | Lire les clients pour les relier à leurs contacts Reponse, écrire les métachamps et les tags décrits ci-dessus |
| `read_orders`, `write_orders` | Suivre les commandes dans la fiche client et créer une commande depuis une conversation |
| `read_fulfillments` | Suivi d'expédition : transporteur, numéro et lien de suivi, pour répondre au client |
| `read_products`, `read_inventory` | Synchroniser le catalogue et vérifier la disponibilité avant de proposer un produit |
| `read_discounts` | Afficher les codes promotionnels par leur nom |
| `read_shipping`, `read_markets`, `read_locales`, `read_translations` | Profils de livraison, marchés, langues et traductions pour répondre dans la bonne langue et avec les bons tarifs |
| `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts` | Jeton de vitrine (Storefront) créé pour le checkout headless : lire le catalogue publié, créer et relire un panier de commande depuis le site ou le chat |

Une seule liste, acceptée une seule fois. Si une future version de l'application demande une permission supplémentaire, Shopify vous demandera de l'accepter à nouveau.

## Utiliser les données dans vos segments

Dans **Clients › Segments**, les métachamps Reponse sont proposés dans l'éditeur de filtres, sous le nom de l'application. Quelques exemples :

```text
metafields.app--{app-id}--reponse.open_tickets > 0
```

Tous les clients qui ont un ticket en cours, pour les exclure d'une campagne promotionnelle par exemple.

```text
metafields.app--{app-id}--reponse.loyalty_points >= 500 AND metafields.app--{app-id}--reponse.reviews_count = 0
```

Les clients fidèles qui n'ont encore jamais laissé d'avis.

```text
customer_tags CONTAINS 'reponse:tier:gold'
```

La même chose par tag, pour les segments déjà construits sur des tags. Remplacez `{app-id}` par l'identifiant que Shopify affiche dans l'éditeur de segments : il vous est proposé par autocomplétion, vous n'avez pas à le connaître de tête.

Ces segments fonctionnent aussi comme déclencheurs dans Shopify Flow et comme audiences dans Shopify Email.

## Délai de rafraîchissement

Reponse ne réécrit pas la fiche client à chaque événement. Quand quelque chose change pour un contact (points crédités, ticket ouvert ou résolu, avis publié, parrainage converti), le contact est mis en file, et la file est traitée toutes les cinq minutes environ. Comptez donc **jusqu'à cinq minutes** entre une action dans Reponse et sa visibilité dans Shopify.

Les valeurs sont calculées au moment de l'écriture, jamais à l'avance : une mise à jour ancienne ne peut pas écraser une valeur plus récente. Si rien n'a changé depuis la dernière écriture, la fiche n'est pas retouchée.

À la connexion de la boutique, Reponse remplit les fiches des clients déjà connus (les clients actifs sur les 90 derniers jours pour un workspace gratuit, tous les clients pour un workspace payant). Sur une grande base, ce remplissage initial prend plusieurs heures : il progresse par lots de 200 clients toutes les cinq minutes, en respectant les limites d'appel de Shopify.

## L'état « autorisation à renouveler »

Il arrive que Shopify refuse une écriture : l'application a été réinstallée, une nouvelle version demande des permissions que vous n'avez pas encore acceptées, ou l'accès a été révoqué depuis l'admin. Dans ce cas Reponse arrête immédiatement d'écrire dans votre boutique, affiche un bandeau **Autorisation à renouveler** dans [Réglages › Intégrations](app:dashboard_integrations) et vous envoie une notification. Le bloc de la fiche client affiche le même état.

Pour corriger : ouvrez une fois l'application Reponse dans votre admin Shopify et acceptez les permissions demandées. Shopify délivre alors une nouvelle autorisation à Reponse, l'écriture reprend d'elle-même et les contacts en attente sont traités au passage suivant. Rien n'est perdu entre-temps.

## Désinstallation

Si vous désinstallez l'application depuis votre admin Shopify :

- Reponse est prévenu et cesse aussitôt d'écrire dans votre boutique. L'autorisation et les réglages associés sont effacés côté Reponse.
- Les métachamps et les tags déjà posés **restent sur vos clients** : Shopify ne les supprime pas, et Reponse n'y touche plus. Vos segments qui les utilisent continuent de fonctionner avec les dernières valeurs connues.
- Le bloc Reponse disparaît de la fiche client.
- Vos contacts, conversations, tickets et avis dans Reponse ne sont pas affectés.

Si vous souhaitez que les métachamps soient effacés de vos clients (ce qui vide aussi les segments construits dessus), écrivez-nous : nous ne le faisons jamais sans votre accord explicite.

## Limites

- **Une boutique par workspace.** Un workspace Reponse ne peut être relié qu'à une seule boutique Shopify. Si vous tentez de relier une seconde boutique, Reponse refuse avec un message clair au lieu de remplacer la première.
- **Token de Custom App.** Les boutiques connectées en collant à la main un token de Custom App (l'ancienne méthode) continuent de fonctionner pour la lecture du catalogue, des commandes et la migration. Elles ne reçoivent ni métachamps, ni tags, ni bloc tant que l'application Reponse n'est pas installée depuis l'App Store : ces fonctions reposent sur l'espace de noms réservé à l'application, auquel un token de Custom App n'a pas accès. Réglages › Intégrations vous le signale et propose l'installation.
- **Clients sans email.** Le lien entre un client Shopify et un contact Reponse se fait par identifiant Shopify, puis par email. Un client Shopify sans adresse email et sans historique dans Reponse n'a rien à afficher.
- **Lecture seule dans Shopify.** Les métachamps sont en lecture seule dans l'admin. Pour créditer des points ou ouvrir un ticket, passez par le dashboard Reponse.

## Confidentialité

Reponse n'exporte vers Shopify que des **compteurs et des états dérivés** : un solde de points, un nom de palier, un nombre d'avis et une note moyenne, un nombre de tickets et une date, un nombre de filleuls, un code de parrainage et un lien. Aucun contenu de conversation, de ticket ou d'avis ne quitte Reponse pour être stocké dans Shopify.

Le bloc de la fiche client affiche davantage (statut des tickets, derniers avis), mais ces informations sont lues à la demande quand un membre de votre équipe ouvre la fiche, avec ses droits d'accès Shopify, et ne sont pas enregistrées dans Shopify.

Dans l'autre sens, Reponse utilise l'identifiant et l'email du client Shopify pour le relier à son contact. Les demandes de suppression et d'export de données client émises par Shopify sont honorées automatiquement : les données du contact sont anonymisées dans Reponse.
