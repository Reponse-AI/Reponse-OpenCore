---
title: "Shopify Sync"
description: "Synchronisez votre catalogue Shopify dans Reponse."
---

## Vue d'ensemble

Reponse synchronise produits, variantes et collections depuis Shopify. Les handles produit viennent directement de Shopify, et les collections sont upsertées sur `workspace_id, handle`.

## Ce qui est synchronisé

Produits, variantes (avec SKU et code-barres), images, collections et stock. Les changements passent par des webhooks pour garder Reponse à jour.

## Webhooks

Voir la référence des webhooks Shopify pour les événements écoutés par Reponse et la gestion des upserts produit.
