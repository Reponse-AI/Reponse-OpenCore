import { client } from './gen/client.gen';
import { 
  getV1Products, 
  getV1ProductsById, 
  getV1Collections,
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
  // New endpoints
  getV1Orders,
  postV1OrdersByOrderIdFulfill,
  postV1OrdersByOrderIdRefund,
  getV1Inventory,
  postV1Inventory,
  getV1Loyalty,
  postV1LoyaltyRedeem,
  getV1LoyaltyReferral,
  getV1GiftCards,
  postV1GiftCards,
  postV1GiftCardsRedeem,
  patchV1SubscriptionsBySubscriptionId,
  getV1Tickets,
  getV1TicketsById,
  postV1Tickets,
  postV1TicketsByIdReply,
  getV1Discounts,
  postV1DiscountsValidate,
  postV1Discounts,
  postV1ApprovalsByApprovalIdExecute,
  postV1ApprovalsByApprovalIdReject,
  getV1UtilsGeocode
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
  };

  // ─── Orders ───────────────────────────────────────────────

  /** Order management: list, fulfill, refund, cancel, and notifications. */
  public orders = {
    /**
     * List orders with optional status filter.
     * @param params.query.status - Filter by status (paid, fulfilled, shipped, cancelled, refunded)
     * @param params.query.limit - Number of orders to return (default 50)
     */
    list: async (params?: Parameters<typeof getV1Orders>[0]) => getV1Orders(params),
    /**
     * Mark an order as fulfilled and optionally attach tracking info.
     * @param params.path.orderId - Order UUID
     * @param params.body.tracking_number - Shipment tracking number
     * @param params.body.tracking_company - Carrier name
     * @param params.body.tracking_url - Tracking URL
     * @param params.body.send_email - Send notification email (default true)
     */
    fulfill: async (params: Parameters<typeof postV1OrdersByOrderIdFulfill>[0]) => postV1OrdersByOrderIdFulfill(params),
    /**
     * Refund an order (full or partial).
     * @param params.path.orderId - Order UUID
     * @param params.body.amount - Partial refund amount (omit for full refund)
     * @param params.body.reason - Reason for the refund
     */
    refund: async (params: Parameters<typeof postV1OrdersByOrderIdRefund>[0]) => postV1OrdersByOrderIdRefund(params),
    /**
     * Update the shipping address of an existing order.
     * @param params.path.orderId - Order UUID
     * @param params.body.shipping_address - New address object
     * @param params.body.conversation_id - Conversation UUID for identity verification
     */
    updateShippingAddress: async (params: Parameters<typeof patchV1OrdersByOrderIdShippingAddress>[0]) => patchV1OrdersByOrderIdShippingAddress(params),
    /**
     * Resend the order confirmation email. Rate limited: max 3 per hour.
     * @param params.path.orderId - Order UUID
     * @param params.body.conversation_id - Conversation UUID for identity verification
     */
    resendConfirmation: async (params: Parameters<typeof postV1OrdersByOrderIdResendConfirmation>[0]) => postV1OrdersByOrderIdResendConfirmation(params),
    /**
     * Resend the invoice email with PDF. Rate limited: max 3 per hour.
     * @param params.path.orderId - Order UUID
     * @param params.body.conversation_id - Conversation UUID for identity verification
     */
    resendInvoice: async (params: Parameters<typeof postV1OrdersByOrderIdResendInvoice>[0]) => postV1OrdersByOrderIdResendInvoice(params),
    /**
     * Cancel an order and trigger a Stripe refund.
     * @param params.path.orderId - Order UUID
     * @param params.body.reason - Cancellation reason enum
     * @param params.body.conversation_id - Conversation UUID for identity verification
     */
    cancel: async (params: Parameters<typeof postV1OrdersByOrderIdCancel>[0]) => postV1OrdersByOrderIdCancel(params),
  };

  // ─── Inventory ────────────────────────────────────────────

  /** Inventory management: check and update stock levels. */
  public inventory = {
    /**
     * Get current inventory levels for a variant, SKU, or product.
     * @param params.query.variant_id - Variant UUID
     * @param params.query.sku - Product/variant SKU
     * @param params.query.product_id - Product UUID
     */
    get: async (params?: Parameters<typeof getV1Inventory>[0]) => getV1Inventory(params),
    /**
     * Set or adjust inventory quantity for a variant.
     * @param params.body.variant_id - Variant UUID
     * @param params.body.quantity - Quantity value
     * @param params.body.mode - 'set' to replace, 'adjust' to add/subtract
     * @param params.body.reason - Reason for the change
     */
    update: async (params?: Parameters<typeof postV1Inventory>[0]) => postV1Inventory(params),
  };

  // ─── Discounts ────────────────────────────────────────────

  /** Discount code operations: list, create, and validate promo codes. */
  public discounts = {
    /**
     * List discount codes. Filter by active status or type.
     * @param params.query.active - Filter by active status
     * @param params.query.type - Filter by type (percentage, fixed_amount, free_shipping, bxgy)
     */
    list: async (params?: Parameters<typeof getV1Discounts>[0]) => getV1Discounts(params),
    /**
     * Validate a discount code and calculate potential savings.
     * @param params.body.code - The discount code to validate
     * @param params.body.cart_total - Cart total for savings calculation
     * @param params.body.cart_quantity - Number of items in cart
     */
    validate: async (params?: Parameters<typeof postV1DiscountsValidate>[0]) => postV1DiscountsValidate(params),
    /**
     * Create a new discount code.
     * @param params.body.code - Code text (will be uppercased)
     * @param params.body.type - Type: percentage, fixed_amount, free_shipping, bxgy
     * @param params.body.value - Discount value
     */
    create: async (params?: Parameters<typeof postV1Discounts>[0]) => postV1Discounts(params),
  };

  // ─── Loyalty ──────────────────────────────────────────────

  /** Loyalty program: points balance, redemption, and referrals. */
  public loyalty = {
    /**
     * Get the loyalty points balance for a contact.
     * @param params.query.contact_id - Contact UUID
     */
    getBalance: async (params: Parameters<typeof getV1Loyalty>[0]) => getV1Loyalty(params),
    /**
     * Redeem loyalty points, optionally against a specific order.
     * @param params.body.contact_id - Contact UUID
     * @param params.body.points - Number of points to redeem
     * @param params.body.order_id - Order UUID to apply the redemption to
     */
    redeem: async (params?: Parameters<typeof postV1LoyaltyRedeem>[0]) => postV1LoyaltyRedeem(params),
    /**
     * Get referral program info for a contact (link, stats, rewards).
     * @param params.query.contact_id - Contact UUID
     */
    getReferralInfo: async (params: Parameters<typeof getV1LoyaltyReferral>[0]) => getV1LoyaltyReferral(params),
  };

  // ─── Gift Cards ───────────────────────────────────────────

  /** Gift card operations: list, create, and redeem gift cards. */
  public giftCards = {
    /**
     * List gift cards in the workspace.
     * @param params.query.limit - Number to return (default 50)
     */
    list: async (params?: Parameters<typeof getV1GiftCards>[0]) => getV1GiftCards(params),
    /**
     * Create a new gift card with an initial monetary value.
     * @param params.body.initial_value - Initial value
     * @param params.body.currency - Currency code (default EUR)
     * @param params.body.code - Custom code (auto-generated if omitted)
     * @param params.body.expires_at - Expiration date (ISO 8601)
     */
    create: async (params?: Parameters<typeof postV1GiftCards>[0]) => postV1GiftCards(params),
    /**
     * Redeem a gift card by applying an amount against it.
     * @param params.body.code - Gift card code
     * @param params.body.amount - Amount to redeem
     * @param params.body.order_id - Order UUID to apply to
     */
    redeem: async (params?: Parameters<typeof postV1GiftCardsRedeem>[0]) => postV1GiftCardsRedeem(params),
  };

  // ─── Tickets ──────────────────────────────────────────────

  /** Support ticket operations: list, create, read, and reply. */
  public tickets = {
    /**
     * List support tickets with optional filters.
     * @param params.query.status - Filter by status (open, pending_customer, resolved, archived)
     * @param params.query.category - Filter by category
     * @param params.query.customer_email - Filter by customer email
     * @param params.query.limit - Number to return (default 20)
     */
    list: async (params?: Parameters<typeof getV1Tickets>[0]) => getV1Tickets(params),
    /**
     * Get a single ticket by ID with full details.
     * @param params.path.id - Ticket UUID
     */
    get: async (params: Parameters<typeof getV1TicketsById>[0]) => getV1TicketsById(params),
    /**
     * Create a new support ticket.
     * @param params.body.customer_email - Customer email
     * @param params.body.subject - Ticket subject
     * @param params.body.message - Initial message body
     * @param params.body.category - Ticket category
     * @param params.body.order_id - Related order UUID
     */
    create: async (params?: Parameters<typeof postV1Tickets>[0]) => postV1Tickets(params),
    /**
     * Reply to a support ticket.
     * @param params.path.id - Ticket UUID
     * @param params.body.message - Reply message body
     */
    reply: async (params: Parameters<typeof postV1TicketsByIdReply>[0]) => postV1TicketsByIdReply(params),
  };

  // ─── Subscriptions ────────────────────────────────────────

  /** Subscription management: delay or trigger shipments. */
  public subscriptions = {
    /**
     * Update a subscription — delay next shipment or trigger immediate shipment.
     * @param params.path.subscriptionId - Subscription UUID
     * @param params.body.action - 'delay' or 'ship_now'
     * @param params.body.target_date - New date for delay action (ISO 8601)
     */
    update: async (params: Parameters<typeof patchV1SubscriptionsBySubscriptionId>[0]) => patchV1SubscriptionsBySubscriptionId(params),
  };

  // ─── Approvals ────────────────────────────────────────────

  /** Approval workflow: execute or reject pending approval requests. */
  public approvals = {
    /**
     * Execute (approve) a pending approval request.
     * @param params.path.approvalId - Approval UUID
     */
    execute: async (params: Parameters<typeof postV1ApprovalsByApprovalIdExecute>[0]) => postV1ApprovalsByApprovalIdExecute(params),
    /**
     * Reject a pending approval request.
     * @param params.path.approvalId - Approval UUID
     * @param params.body.reason - Reason for rejection
     */
    reject: async (params: Parameters<typeof postV1ApprovalsByApprovalIdReject>[0]) => postV1ApprovalsByApprovalIdReject(params),
  };

  // ─── Utilities ────────────────────────────────────────────

  /** Utility operations: geocoding and address resolution. */
  public utils = {
    /**
     * Geocode a free-form address into coordinates and structured components.
     * @param params.query.address - The address string to geocode
     */
    geocodeAddress: async (params: Parameters<typeof getV1UtilsGeocode>[0]) => getV1UtilsGeocode(params),
  };
}
