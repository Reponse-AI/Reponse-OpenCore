import { client } from './gen/client.gen';
import { 
  getV1Products, 
  getV1ProductsById, 
  getV1Collections,
  getV1CollectionsByHandle,
  getV1CollectionsByHandleProducts,
  postV1Carts,
  getV1CartsById,
  postV1CartsByIdItems,
  putV1CartsByIdItemsByLineId,
  deleteV1CartsByIdItemsByLineId,
  patchV1OrdersByOrderIdShippingAddress,
  postV1OrdersByOrderIdResendConfirmation,
  postV1OrdersByOrderIdResendInvoice,
  postV1OrdersByOrderIdCancel,
  postV1CheckoutStripe,
  getV1Theme,
  getV1ShippingRates,
  getV1Policies,
  getV1PoliciesByType,
} from './gen/sdk.gen';

export * from './gen/types.gen';
export * from './gen/sdk.gen';
export { client } from './gen/client.gen';

export interface ReponseOptions {
  /** Your Reponse API key (server-side only, never expose in client bundles). */
  apiKey: string;
  /** Base URL for the Reponse API. Defaults to https://api.reponse.ai */
  baseUrl?: string;
}

/**
 * Reponse SDK — Headless Commerce + AI client.
 * 
 * @example
 * ```typescript
 * import { Reponse } from '@reponseai/sdk';
 * const reponse = new Reponse({ apiKey: process.env.REPONSE_API_KEY! });
 * const { data } = await reponse.catalog.listProducts({ query: { limit: 12 } });
 * ```
 */
export class Reponse {
  constructor(options: ReponseOptions) {
    client.setConfig({
      baseUrl: options.baseUrl || 'https://api.reponse.ai',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
      },
    });
  }

  // ─── Catalog ──────────────────────────────────────────────

  /** Product catalog operations: list, search, and retrieve products and collections. */
  public catalog = {
    /**
     * List products from the catalog.
     * @param params.query.limit - Number of products to return (1-100, default 50)
     * @param params.query.cursor - Cursor for pagination
     * @param params.query.query - Search query to filter by title
     * @param params.query.slug - Filter by product slug/handle
     * @returns Paginated list of products with variants and pricing
     */
    listProducts: async (params?: Parameters<typeof getV1Products>[0]) => getV1Products(params),
    /**
     * Get a single product by its ID with full details (variants, images, pricing).
     * @param params.path.id - The UUID of the product
     */
    getProduct: async (params: Parameters<typeof getV1ProductsById>[0]) => getV1ProductsById(params),
    /**
     * List all product collections/categories.
     * @param params.query.limit - Number of collections to return (default 50)
     */
    listCollections: async (params?: Parameters<typeof getV1Collections>[0]) => getV1Collections(params),
    /**
     * Get a single collection by its handle/slug with metadata and product count.
     * @param params.path.handle - The collection handle
     */
    getCollection: async (params: Parameters<typeof getV1CollectionsByHandle>[0]) => getV1CollectionsByHandle(params),
    /**
     * List products belonging to a specific collection.
     * @param params.path.handle - The collection handle
     * @param params.query.limit - Number of products to return (1-100, default 50)
     * @param params.query.offset - Pagination offset (default 0)
     */
    getCollectionProducts: async (params: Parameters<typeof getV1CollectionsByHandleProducts>[0]) => getV1CollectionsByHandleProducts(params),
  };

  // ─── Cart ─────────────────────────────────────────────────

  /** Shopping cart operations: create, read, add/update/remove items. */
  public cart = {
    /**
     * Create a new shopping cart.
     * @param params.body.currency - Currency code (default EUR)
     * @param params.body.items - Optional initial items to add
     */
    create: async (params?: Parameters<typeof postV1Carts>[0]) => postV1Carts(params),
    /**
     * Get an existing cart by ID with items and totals.
     * @param params.path.id - The UUID of the cart
     */
    get: async (params: Parameters<typeof getV1CartsById>[0]) => getV1CartsById(params),
    /**
     * Add items to an existing cart.
     * @param params.path.id - Cart UUID
     * @param params.body.items - Array of { product_id, variant_id?, quantity }
     */
    addItem: async (params: Parameters<typeof postV1CartsByIdItems>[0]) => postV1CartsByIdItems(params),
    /**
     * Update the quantity of a cart line item. Set quantity to 0 to remove.
     * @param params.path.id - Cart UUID
     * @param params.path.lineId - Line item UUID
     * @param params.body.quantity - New quantity
     */
    updateItem: async (params: Parameters<typeof putV1CartsByIdItemsByLineId>[0]) => putV1CartsByIdItemsByLineId(params),
    /**
     * Remove an item from a cart completely.
     * @param params.path.id - Cart UUID
     * @param params.path.lineId - Line item UUID to remove
     */
    removeItem: async (params: Parameters<typeof deleteV1CartsByIdItemsByLineId>[0]) => deleteV1CartsByIdItemsByLineId(params),
    /**
     * Create a Stripe Checkout session for a cart. Returns a redirect URL.
     * @param params.body.cart_id - Cart UUID
     * @param params.body.success_url - Redirect URL after successful payment
     * @param params.body.cancel_url - Redirect URL if payment is cancelled
     */
    createCheckout: async (params?: Parameters<typeof postV1CheckoutStripe>[0]) => postV1CheckoutStripe(params),
    /**
     * Calculate shipping rates for a cart.
     * @param params.query.cart_id - Cart UUID
     * @param params.query.market_id - Optional market UUID
     * @param params.query.country - Optional ISO country code
     */
    getShippingRates: async (params: Parameters<typeof getV1ShippingRates>[0]) => getV1ShippingRates(params),
  };

  // ─── Orders ───────────────────────────────────────────────

  /** Order management: update address, resend emails, cancel. */
  public orders = {
    /**
     * Update the shipping address of an existing order.
     * @param params.path.orderId - Order UUID
     * @param params.body.shipping_address - New address object
     */
    updateShippingAddress: async (params: Parameters<typeof patchV1OrdersByOrderIdShippingAddress>[0]) => patchV1OrdersByOrderIdShippingAddress(params),
    /**
     * Resend the order confirmation email.
     * @param params.path.orderId - Order UUID
     */
    resendConfirmation: async (params: Parameters<typeof postV1OrdersByOrderIdResendConfirmation>[0]) => postV1OrdersByOrderIdResendConfirmation(params),
    /**
     * Resend the invoice email with PDF.
     * @param params.path.orderId - Order UUID
     */
    resendInvoice: async (params: Parameters<typeof postV1OrdersByOrderIdResendInvoice>[0]) => postV1OrdersByOrderIdResendInvoice(params),
    /**
     * Cancel an order and trigger a Stripe refund.
     * @param params.path.orderId - Order UUID
     * @param params.body.reason - Cancellation reason enum
     */
    cancel: async (params: Parameters<typeof postV1OrdersByOrderIdCancel>[0]) => postV1OrdersByOrderIdCancel(params),
  };

  // TODO: Add to OpenAPI spec when needed:
  // inventory, discounts, loyalty, giftCards, tickets, subscriptions, approvals, utils

  // ─── Storefront ──────────────────────────────────────────

  /** Storefront operations: theme, legal policies. */
  public storefront = {
    /**
     * Get workspace theme as CSS custom properties.
     */
    getTheme: async (params?: Parameters<typeof getV1Theme>[0]) => getV1Theme(params),
    /**
     * List all legal policies for the workspace.
     * @param params.query.locale - Locale filter (default "fr")
     */
    listPolicies: async (params?: Parameters<typeof getV1Policies>[0]) => getV1Policies(params),
    /**
     * Get a specific legal policy by type.
     * @param params.path.type - Policy type slug (e.g. "privacy-policy")
     */
    getPolicy: async (params: Parameters<typeof getV1PoliciesByType>[0]) => getV1PoliciesByType(params),
  };
}

