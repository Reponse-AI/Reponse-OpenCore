---
title: "Chat Widget"
description: "Embed the Reponse chat widget on your site."
---

## Overview

The Reponse chat widget brings the AI activation layer to any page on your site. It answers shopper questions in real time, guides them toward purchase, and captures leads — all without leaving the page. You can embed it as a script snippet or as an iframe.

## Prerequisites

- A Reponse workspace with at least one campaign configured
- Your campaign ID (found in **Dashboard → Campaigns**)

## Step 1 — Script Embed (Recommended)

Add the following snippet before the closing `</body>` tag of your site:

```html
<script
  src="https://cdn.reponse.ai/widget/v1/loader.js"
  data-campaign-id="YOUR_CAMPAIGN_ID"
  data-theme="auto"
  async
></script>
```

The widget loads asynchronously and does not block page rendering.

## Step 2 — Iframe Embed

If you prefer full isolation, embed the widget in an iframe:

```html
<iframe
  src="https://reponse.ai/en/c-embed/YOUR_CAMPAIGN_ID"
  width="400"
  height="600"
  style="border: none; border-radius: 12px;"
  allow="clipboard-write"
></iframe>
```

The `c-embed` route sets permissive `frame-ancestors` headers, so the iframe works on any origin.

## Customization

Pass `data-*` attributes on the script tag to customize the widget appearance:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data-campaign-id` | `string` | — | **Required.** Your campaign ID. |
| `data-theme` | `"light"` \| `"dark"` \| `"auto"` | `"auto"` | Color theme. `auto` inherits from the page. |
| `data-position` | `"bottom-right"` \| `"bottom-left"` | `"bottom-right"` | Widget button position. |
| `data-accent-color` | CSS color | Workspace default | Primary accent color for the widget. |
| `data-locale` | `"en"` \| `"fr"` | Auto-detected | Force a specific language. |
| `data-open` | `"true"` \| `"false"` | `"false"` | Open the widget on page load. |

## Events API

The widget emits custom events on `window` that you can listen to:

```javascript
window.addEventListener("reponse:ready", () => {
  console.log("Widget loaded");
});

window.addEventListener("reponse:message", (e) => {
  console.log("New message:", e.detail);
});

window.addEventListener("reponse:lead", (e) => {
  console.log("Lead captured:", e.detail.email);
});
```

| Event | Payload | Description |
| --- | --- | --- |
| `reponse:ready` | `{}` | Widget has fully initialized. |
| `reponse:open` | `{}` | Chat panel was opened. |
| `reponse:close` | `{}` | Chat panel was closed. |
| `reponse:message` | `{ role, content }` | A message was sent or received. |
| `reponse:lead` | `{ email }` | A lead email was captured. |

## Programmatic Control

After the widget is ready, use the global `ReponseWidget` object:

```javascript
// Open the widget
ReponseWidget.open();

// Close the widget
ReponseWidget.close();

// Send a message programmatically
ReponseWidget.send("Show me your best deals");
```

## UTM Passthrough

The widget automatically reads UTM parameters from the page URL and forwards them to the AI engine dispatcher. This enables automatic engine selection (e.g., `fr-ecom-turbo-v1` for social traffic). No additional configuration is required.

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Widget does not appear | Verify the `data-campaign-id` is correct and the campaign is published. |
| Iframe blocked | Check that your CSP allows framing from `reponse.ai`. |
| Wrong language | Set `data-locale` explicitly on the script tag. |
| Events not firing | Ensure the listener is registered before the script loads. |
