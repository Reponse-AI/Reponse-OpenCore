---
title: Flux Produit (XML)
description: Flux produits XML pour Google Shopping, Meta, Pinterest, Snapchat et TikTok
---

# Flux Produit (XML)

Reponse génère des flux produits XML spécifiques à chaque plateforme shopping. Chaque flux est un document RSS 2.0 utilisant le namespace `g:` (Google Base), compatible avec toutes les plateformes majeures.

## Endpoints

| Plateforme | URL | Politique d'activation |
|---|---|---|
| Google Merchant Center | `/api/seo/merchant-center/{workspaceId}/feed.xml` | `merchantCenter` |
| Meta / Facebook | `/api/seo/facebook/{workspaceId}/feed.xml` | `facebookCatalog` |
| Pinterest | `/api/seo/pinterest/{workspaceId}/feed.xml` | `pinterestCatalog` |
| Snapchat | `/api/seo/snapchat/{workspaceId}/feed.xml` | `snapchatCatalog` |
| TikTok | `/api/seo/tiktok/{workspaceId}/feed.xml` | `tiktokCatalog` |

## Activation

Activez chaque flux depuis **Paramètres → Canaux** dans le dashboard. Activez le toggle de la plateforme correspondante pour générer l'URL du flux.

## Champs

Tous les flux incluent les champs produit suivants par variante :

| Champ | Description |
|---|---|
| `g:id` | Identifiant unique de la variante (`productId_variantId`) |
| `g:title` | Titre du produit + titre de la variante |
| `g:description` | Description sans HTML (longueur max selon la plateforme) |
| `g:link` | URL de la page produit storefront |
| `g:image_link` | Image principale du produit |
| `g:additional_image_link` | Jusqu'à 10–20 images supplémentaires (selon la plateforme) |
| `g:availability` | Statut du stock (format spécifique par plateforme) |
| `g:price` | Prix affiché avec code devise |
| `g:sale_price` | Prix soldé (si `compare_at_price > price`) |
| `g:brand` | Vendeur du produit (fallback : nom du workspace) |
| `g:condition` | Toujours `new` |
| `g:gtin` | Code-barres du produit |
| `g:mpn` | SKU du produit (quand pas de code-barres) |
| `g:identifier_exists` | `true`/`false` (Google uniquement) |
| `g:google_product_category` | Chemin taxonomie Google |
| `g:product_type` | Catégorie marchand |
| `g:item_group_id` | ID produit (regroupe les variantes) |
| `g:color` | Extrait des options de la variante |
| `g:size` | Extrait des options de la variante |
| `g:shipping_weight` | Poids avec unité |
| `g:custom_label_0–4` | Labels de segmentation campagnes |

## Custom Labels

Labels auto-dérivés pour la segmentation des campagnes publicitaires :

| Label | Contenu | Cas d'usage |
|---|---|---|
| `custom_label_0` | Type de produit / catégorie | Campagnes par catégorie |
| `custom_label_1` | `On Sale` (si en promotion) | Campagnes soldes |
| `custom_label_2` | Tranche de prix (`0-25`, `25-50`, `50-100`, `100-200`, `200+`) | Enchères par tranche de prix |
| `custom_label_3` | Niveau de stock (`In Stock` / `Low Stock` / `Out of Stock`) | Enchères prioritaires |
| `custom_label_4` | Marque / vendeur | Campagnes par marque |

Les custom labels sont émis pour les flux Google, Meta, Pinterest et Snapchat.

## Différences par plateforme

| Plateforme | Format disponibilité | Description max | Images supplémentaires |
|---|---|---|---|
| Google | `in_stock` / `out_of_stock` | 5 000 caractères | 10 |
| Meta | `in stock` / `out of stock` | 9 999 caractères | 20 |
| Pinterest | `in stock` / `out of stock` | 500 caractères | 10 |
| Snapchat | `In stock` / `Out of stock` | 5 000 caractères | 10 |
| TikTok | `in_stock` / `out_of_stock` | 5 000 caractères | 10 |

## Cache

Tous les flux sont mis en cache pendant **1 heure** (`Cache-Control: public, max-age=3600`).

## Découverte

Les URLs des flux sont découvrables via le [manifest UCP](/.well-known/ucp) à `/.well-known/ucp`.
