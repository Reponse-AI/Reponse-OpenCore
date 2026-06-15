type ClientOptions$1 = {
    baseUrl: 'https://api.reponse.ai' | (string & {});
};
type ProductVariant = {
    id: string;
    title: string;
    price: number | null;
    compare_at_price: number | null;
    inventory_quantity: number;
    sku: string | null;
    option_values: Array<string> | null;
};
type Product = {
    id: string;
    title: string;
    slug: string | null;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    price: number;
    compare_at_price: number | null;
    currency: string;
    in_stock: boolean;
    images: Array<string>;
    status: 'active' | 'draft' | 'archived';
    variants?: Array<ProductVariant>;
    created_at: string;
    updated_at: string;
};
type ProductListResponse = {
    data: Array<Product>;
    next_cursor: string | null;
    has_more: boolean;
};
type Collection = {
    id: string;
    title: string;
    description: string | null;
};
type CollectionListResponse = {
    data: Array<Collection>;
};
type Cart = {
    id: string;
    items: Array<{
        id: string;
        product_id: string;
        variant_id?: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    currency: string;
    created_at: string;
    updated_at: string;
};
type CreateCartInput = {
    items?: Array<{
        product_id: string;
        variant_id?: string;
        quantity: number;
    }>;
    currency?: string;
};
type CheckoutSession = {
    url: string;
};
type CreateCheckoutInput = {
    cart_id: string;
    success_url?: string;
    cancel_url?: string;
};
type AddCartItemInput = {
    product_id: string;
    variant_id?: string;
    quantity?: number;
};
type UpdateCartItemInput = {
    /**
     * New quantity. Set to 0 to remove item.
     */
    quantity: number;
};
type Order = {
    id: string;
    status: 'paid' | 'fulfilled' | 'shipped' | 'cancelled' | 'refunded';
    customer_email?: string;
    total: number;
    currency: string;
    items: Array<{
        product_id?: string;
        variant_id?: string;
        quantity?: number;
        price?: number;
    }>;
    shipping_address?: {
        address1?: string;
        address2?: string;
        city?: string;
        zip?: string;
        country?: string;
    } | null;
    tracking_number?: string | null;
    tracking_company?: string | null;
    tracking_url?: string | null;
    created_at: string;
    updated_at: string;
};
type OrderListResponse = {
    data: Array<Order>;
};
type Ticket = {
    id: string;
    customer_email: string;
    subject: string;
    message: string;
    status: 'open' | 'pending_customer' | 'resolved' | 'archived';
    category?: 'shipping' | 'return_refund' | 'defective_product' | 'payment' | 'product_question' | 'other';
    order_id?: string | null;
    created_at: string;
};
type TicketListResponse = {
    data: Array<Ticket>;
};
type DiscountCode = {
    id: string;
    code: string;
    type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'bxgy';
    value: number;
    active: boolean;
    starts_at?: string | null;
    end_at?: string | null;
    usage_limit_total?: number | null;
    usage_count?: number;
    conditions?: string | null;
};
type DiscountListResponse = {
    data: Array<DiscountCode>;
};
type DiscountValidation = {
    valid: boolean;
    discount?: DiscountCode;
    savings?: number | null;
    message?: string;
};
type InventoryLevel = {
    variant_id: string;
    sku?: string | null;
    quantity: number;
    product_id?: string;
};
type LoyaltyBalance = {
    contact_id: string;
    points: number;
    tier?: string | null;
};
type ReferralInfo = {
    contact_id: string;
    referral_link: string;
    referrals_count?: number;
    rewards_earned?: number;
};
type GiftCard = {
    id: string;
    code: string;
    initial_value: number;
    balance: number;
    currency: string;
    expires_at?: string | null;
    active: boolean;
};
type GiftCardListResponse = {
    data: Array<GiftCard>;
};
type Subscription = {
    id: string;
    status: string;
    next_shipment_date?: string | null;
};
type SuccessResponse = {
    success: boolean;
    message?: string;
};
type GeocodeResult = {
    lat: number;
    lng: number;
    formatted_address: string;
    components?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
};
type GetV1ProductsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Number of items to return
         */
        limit?: number;
        /**
         * Cursor for pagination
         */
        cursor?: string;
        /**
         * Search query
         */
        query?: string;
        /**
         * Filter by slug (handle)
         */
        slug?: string;
    };
    url: '/v1/products';
};
type GetV1ProductsResponses = {
    /**
     * A list of products
     */
    200: ProductListResponse;
};
type GetV1ProductsResponse = GetV1ProductsResponses[keyof GetV1ProductsResponses];
type GetV1ProductsByIdData = {
    body?: never;
    path: {
        /**
         * Product ID
         */
        id: string;
    };
    query?: never;
    url: '/v1/products/{id}';
};
type GetV1ProductsByIdErrors = {
    /**
     * Product not found
     */
    404: unknown;
};
type GetV1ProductsByIdResponses = {
    /**
     * The product
     */
    200: Product;
};
type GetV1ProductsByIdResponse = GetV1ProductsByIdResponses[keyof GetV1ProductsByIdResponses];
type PostV1CartsData = {
    body?: CreateCartInput;
    path?: never;
    query?: never;
    url: '/v1/carts';
};
type PostV1CartsResponses = {
    /**
     * The created cart
     */
    201: Cart;
};
type PostV1CartsResponse = PostV1CartsResponses[keyof PostV1CartsResponses];
type GetV1CartsByIdData = {
    body?: never;
    path: {
        /**
         * Cart ID
         */
        id: string;
    };
    query?: never;
    url: '/v1/carts/{id}';
};
type GetV1CartsByIdErrors = {
    /**
     * Cart not found
     */
    404: unknown;
};
type GetV1CartsByIdResponses = {
    /**
     * The cart
     */
    200: Cart;
};
type GetV1CartsByIdResponse = GetV1CartsByIdResponses[keyof GetV1CartsByIdResponses];
type PostV1CartsByIdItemsData = {
    body?: {
        /**
         * Items to add to cart
         */
        items: Array<{
            product_id: string;
            variant_id?: string;
            quantity?: number;
        }>;
    };
    path: {
        /**
         * Cart ID
         */
        id: string;
    };
    query?: never;
    url: '/v1/carts/{id}/items';
};
type PostV1CartsByIdItemsErrors = {
    /**
     * Bad request (e.g. variant_id required)
     */
    400: unknown;
    /**
     * Cart not found
     */
    404: unknown;
};
type PostV1CartsByIdItemsResponses = {
    /**
     * Success
     */
    200: unknown;
};
type DeleteV1CartsByIdItemsByLineIdData = {
    body?: never;
    path: {
        /**
         * Cart ID
         */
        id: string;
        /**
         * Line Item ID
         */
        lineId: string;
    };
    query?: never;
    url: '/v1/carts/{id}/items/{lineId}';
};
type DeleteV1CartsByIdItemsByLineIdErrors = {
    /**
     * Cart not found
     */
    404: unknown;
};
type DeleteV1CartsByIdItemsByLineIdResponses = {
    /**
     * Success
     */
    200: unknown;
};
type PutV1CartsByIdItemsByLineIdData = {
    body?: {
        /**
         * New quantity (0 to delete)
         */
        quantity: number;
    };
    path: {
        /**
         * Cart ID
         */
        id: string;
        /**
         * Line Item ID
         */
        lineId: string;
    };
    query?: never;
    url: '/v1/carts/{id}/items/{lineId}';
};
type PutV1CartsByIdItemsByLineIdErrors = {
    /**
     * Invalid quantity
     */
    400: unknown;
    /**
     * Cart not found
     */
    404: unknown;
};
type PutV1CartsByIdItemsByLineIdResponses = {
    /**
     * Success
     */
    200: unknown;
};
type PatchV1OrdersByOrderIdShippingAddressData = {
    body?: {
        shipping_address: {
            address1: string;
            address2?: string;
            city: string;
            zip: string;
            country: string;
        };
        /**
         * Optional conversation ID for B2C conversational security
         */
        conversation_id?: string;
    };
    path: {
        /**
         * Order ID
         */
        orderId: string;
    };
    query?: never;
    url: '/v1/orders/{orderId}/shipping-address';
};
type PatchV1OrdersByOrderIdShippingAddressErrors = {
    /**
     * Bad request or business rule validation failed (e.g., order already shipped)
     */
    400: unknown;
    /**
     * Forbidden - B2C identity verification failed
     */
    403: unknown;
    /**
     * Order not found
     */
    404: unknown;
};
type PatchV1OrdersByOrderIdShippingAddressResponses = {
    /**
     * The updated order
     */
    200: {
        success: boolean;
        confirmation_message?: string;
        notify_merchant?: boolean;
        event_id?: string;
    };
};
type PatchV1OrdersByOrderIdShippingAddressResponse = PatchV1OrdersByOrderIdShippingAddressResponses[keyof PatchV1OrdersByOrderIdShippingAddressResponses];
type PostV1OrdersByOrderIdResendConfirmationData = {
    body?: {
        /**
         * Optional conversation ID for B2C conversational security
         */
        conversation_id?: string;
    };
    path: {
        /**
         * Order ID
         */
        orderId: string;
    };
    query?: never;
    url: '/v1/orders/{orderId}/resend-confirmation';
};
type PostV1OrdersByOrderIdResendConfirmationErrors = {
    /**
     * Bad request or business validation failed
     */
    400: unknown;
    /**
     * Forbidden - Identity not verified
     */
    403: unknown;
    /**
     * Order not found
     */
    404: unknown;
    /**
     * Too many requests (rate limited)
     */
    429: unknown;
};
type PostV1OrdersByOrderIdResendConfirmationResponses = {
    /**
     * Confirmation sent
     */
    200: {
        success: boolean;
        confirmation_message?: string;
        event_id?: string;
    };
};
type PostV1OrdersByOrderIdResendConfirmationResponse = PostV1OrdersByOrderIdResendConfirmationResponses[keyof PostV1OrdersByOrderIdResendConfirmationResponses];
type PostV1OrdersByOrderIdResendInvoiceData = {
    body?: {
        /**
         * Optional conversation ID for B2C conversational security
         */
        conversation_id?: string;
    };
    path: {
        /**
         * Order ID
         */
        orderId: string;
    };
    query?: never;
    url: '/v1/orders/{orderId}/resend-invoice';
};
type PostV1OrdersByOrderIdResendInvoiceErrors = {
    /**
     * Bad request or invoice is generating
     */
    400: unknown;
    /**
     * Forbidden - Identity not verified
     */
    403: unknown;
    /**
     * Invoice or Order not found
     */
    404: unknown;
    /**
     * Too many requests (rate limited)
     */
    429: unknown;
    /**
     * Invoice generation failed
     */
    500: unknown;
};
type PostV1OrdersByOrderIdResendInvoiceResponses = {
    /**
     * Invoice sent
     */
    200: {
        success: boolean;
        confirmation_message?: string;
        event_id?: string;
    };
};
type PostV1OrdersByOrderIdResendInvoiceResponse = PostV1OrdersByOrderIdResendInvoiceResponses[keyof PostV1OrdersByOrderIdResendInvoiceResponses];
type PostV1OrdersByOrderIdCancelData = {
    body?: {
        /**
         * Optional conversation ID
         */
        conversation_id?: string;
        /**
         * Reason for cancellation
         */
        reason: 'customer_changed_mind' | 'wrong_item_ordered' | 'delivery_too_slow_anticipated' | 'found_better_price' | 'payment_issue' | 'other';
        /**
         * Custom reason if reason is other
         */
        custom_reason?: string;
    };
    path: {
        /**
         * Order ID
         */
        orderId: string;
    };
    query?: never;
    url: '/v1/orders/{orderId}/cancel';
};
type PostV1OrdersByOrderIdCancelErrors = {
    /**
     * Bad request or business validation failed
     */
    400: unknown;
    /**
     * Forbidden - Identity not verified
     */
    403: unknown;
    /**
     * Order not found
     */
    404: unknown;
    /**
     * Too many requests (rate limited) or abuse detected
     */
    429: unknown;
    /**
     * Stripe refund failed or internal error
     */
    500: unknown;
};
type PostV1OrdersByOrderIdCancelResponses = {
    /**
     * Order cancelled successfully
     */
    200: unknown;
};
type GetV1CollectionsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Number of items to return
         */
        limit?: number;
    };
    url: '/v1/collections';
};
type GetV1CollectionsResponses = {
    /**
     * A list of collections
     */
    200: CollectionListResponse;
};
type GetV1CollectionsResponse = GetV1CollectionsResponses[keyof GetV1CollectionsResponses];
type PostV1CheckoutStripeData = {
    body?: CreateCheckoutInput;
    path?: never;
    query?: never;
    url: '/v1/checkout/stripe';
};
type PostV1CheckoutStripeResponses = {
    /**
     * The checkout session URL
     */
    200: CheckoutSession;
};
type PostV1CheckoutStripeResponse = PostV1CheckoutStripeResponses[keyof PostV1CheckoutStripeResponses];
type GetV1OrdersData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Filter by order status
         */
        status?: 'paid' | 'fulfilled' | 'shipped' | 'cancelled' | 'refunded';
        /**
         * Number of items to return
         */
        limit?: number;
    };
    url: '/v1/orders';
};
type GetV1OrdersResponses = {
    /**
     * A list of orders
     */
    200: OrderListResponse;
};
type GetV1OrdersResponse = GetV1OrdersResponses[keyof GetV1OrdersResponses];
type PostV1OrdersByOrderIdFulfillData = {
    body?: {
        tracking_number?: string;
        tracking_company?: string;
        tracking_url?: string;
        send_email?: boolean;
    };
    path: {
        /**
         * Order ID
         */
        orderId: string;
    };
    query?: never;
    url: '/v1/orders/{orderId}/fulfill';
};
type PostV1OrdersByOrderIdFulfillResponses = {
    /**
     * Order fulfilled successfully
     */
    200: SuccessResponse;
};
type PostV1OrdersByOrderIdFulfillResponse = PostV1OrdersByOrderIdFulfillResponses[keyof PostV1OrdersByOrderIdFulfillResponses];
type PostV1OrdersByOrderIdRefundData = {
    body?: {
        /**
         * Partial refund amount. Omit for full refund.
         */
        amount?: number;
        reason?: string;
        note?: string;
    };
    path: {
        /**
         * Order ID
         */
        orderId: string;
    };
    query?: never;
    url: '/v1/orders/{orderId}/refund';
};
type PostV1OrdersByOrderIdRefundResponses = {
    /**
     * Order refunded successfully
     */
    200: SuccessResponse;
};
type PostV1OrdersByOrderIdRefundResponse = PostV1OrdersByOrderIdRefundResponses[keyof PostV1OrdersByOrderIdRefundResponses];
type GetV1InventoryData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Filter by variant ID
         */
        variant_id?: string;
        /**
         * Filter by SKU
         */
        sku?: string;
        /**
         * Filter by product ID
         */
        product_id?: string;
    };
    url: '/v1/inventory';
};
type GetV1InventoryResponses = {
    /**
     * Inventory level
     */
    200: InventoryLevel;
};
type GetV1InventoryResponse = GetV1InventoryResponses[keyof GetV1InventoryResponses];
type PostV1InventoryData = {
    body?: {
        variant_id: string;
        quantity: number;
        /**
         * Set absolute quantity or adjust by delta
         */
        mode?: 'set' | 'adjust';
        reason?: string;
    };
    path?: never;
    query?: never;
    url: '/v1/inventory';
};
type PostV1InventoryResponses = {
    /**
     * Updated inventory level
     */
    200: InventoryLevel;
};
type PostV1InventoryResponse = PostV1InventoryResponses[keyof PostV1InventoryResponses];
type GetV1LoyaltyData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Contact ID
         */
        contact_id: string;
    };
    url: '/v1/loyalty';
};
type GetV1LoyaltyResponses = {
    /**
     * Loyalty balance
     */
    200: LoyaltyBalance;
};
type GetV1LoyaltyResponse = GetV1LoyaltyResponses[keyof GetV1LoyaltyResponses];
type PostV1LoyaltyRedeemData = {
    body?: {
        contact_id: string;
        points: number;
        order_id?: string;
    };
    path?: never;
    query?: never;
    url: '/v1/loyalty/redeem';
};
type PostV1LoyaltyRedeemResponses = {
    /**
     * Points redeemed successfully
     */
    200: SuccessResponse;
};
type PostV1LoyaltyRedeemResponse = PostV1LoyaltyRedeemResponses[keyof PostV1LoyaltyRedeemResponses];
type GetV1LoyaltyReferralData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Contact ID
         */
        contact_id: string;
    };
    url: '/v1/loyalty/referral';
};
type GetV1LoyaltyReferralResponses = {
    /**
     * Referral information
     */
    200: ReferralInfo;
};
type GetV1LoyaltyReferralResponse = GetV1LoyaltyReferralResponses[keyof GetV1LoyaltyReferralResponses];
type GetV1GiftCardsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Number of items to return
         */
        limit?: number;
    };
    url: '/v1/gift-cards';
};
type GetV1GiftCardsResponses = {
    /**
     * A list of gift cards
     */
    200: GiftCardListResponse;
};
type GetV1GiftCardsResponse = GetV1GiftCardsResponses[keyof GetV1GiftCardsResponses];
type PostV1GiftCardsData = {
    body?: {
        initial_value: number;
        currency?: string;
        code?: string;
        expires_at?: string;
    };
    path?: never;
    query?: never;
    url: '/v1/gift-cards';
};
type PostV1GiftCardsResponses = {
    /**
     * The created gift card
     */
    201: GiftCard;
};
type PostV1GiftCardsResponse = PostV1GiftCardsResponses[keyof PostV1GiftCardsResponses];
type PostV1GiftCardsRedeemData = {
    body?: {
        code: string;
        amount: number;
        order_id?: string;
    };
    path?: never;
    query?: never;
    url: '/v1/gift-cards/redeem';
};
type PostV1GiftCardsRedeemResponses = {
    /**
     * Gift card redeemed successfully
     */
    200: SuccessResponse;
};
type PostV1GiftCardsRedeemResponse = PostV1GiftCardsRedeemResponses[keyof PostV1GiftCardsRedeemResponses];
type PatchV1SubscriptionsBySubscriptionIdData = {
    body?: {
        action: 'delay' | 'ship_now';
        target_date?: string;
    };
    path: {
        /**
         * Subscription ID
         */
        subscriptionId: string;
    };
    query?: never;
    url: '/v1/subscriptions/{subscriptionId}';
};
type PatchV1SubscriptionsBySubscriptionIdResponses = {
    /**
     * Updated subscription
     */
    200: Subscription;
};
type PatchV1SubscriptionsBySubscriptionIdResponse = PatchV1SubscriptionsBySubscriptionIdResponses[keyof PatchV1SubscriptionsBySubscriptionIdResponses];
type GetV1TicketsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Filter by ticket status
         */
        status?: 'open' | 'pending_customer' | 'resolved' | 'archived';
        /**
         * Filter by category
         */
        category?: 'shipping' | 'return_refund' | 'defective_product' | 'payment' | 'product_question' | 'other';
        /**
         * Filter by customer email
         */
        customer_email?: string;
        /**
         * Number of items to return
         */
        limit?: number;
    };
    url: '/v1/tickets';
};
type GetV1TicketsResponses = {
    /**
     * A list of tickets
     */
    200: TicketListResponse;
};
type GetV1TicketsResponse = GetV1TicketsResponses[keyof GetV1TicketsResponses];
type PostV1TicketsData = {
    body?: {
        customer_email: string;
        subject: string;
        message: string;
        category?: 'shipping' | 'return_refund' | 'defective_product' | 'payment' | 'product_question' | 'other';
        order_id?: string;
    };
    path?: never;
    query?: never;
    url: '/v1/tickets';
};
type PostV1TicketsResponses = {
    /**
     * The created ticket
     */
    201: Ticket;
};
type PostV1TicketsResponse = PostV1TicketsResponses[keyof PostV1TicketsResponses];
type GetV1TicketsByIdData = {
    body?: never;
    path: {
        /**
         * Ticket ID
         */
        id: string;
    };
    query?: never;
    url: '/v1/tickets/{id}';
};
type GetV1TicketsByIdErrors = {
    /**
     * Ticket not found
     */
    404: unknown;
};
type GetV1TicketsByIdResponses = {
    /**
     * The ticket
     */
    200: Ticket;
};
type GetV1TicketsByIdResponse = GetV1TicketsByIdResponses[keyof GetV1TicketsByIdResponses];
type PostV1TicketsByIdReplyData = {
    body?: {
        message: string;
    };
    path: {
        /**
         * Ticket ID
         */
        id: string;
    };
    query?: never;
    url: '/v1/tickets/{id}/reply';
};
type PostV1TicketsByIdReplyResponses = {
    /**
     * Reply sent successfully
     */
    200: SuccessResponse;
};
type PostV1TicketsByIdReplyResponse = PostV1TicketsByIdReplyResponses[keyof PostV1TicketsByIdReplyResponses];
type GetV1DiscountsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Filter by active status
         */
        active?: boolean;
        /**
         * Filter by discount type
         */
        type?: 'percentage' | 'fixed_amount' | 'free_shipping' | 'bxgy';
    };
    url: '/v1/discounts';
};
type GetV1DiscountsResponses = {
    /**
     * A list of discount codes
     */
    200: DiscountListResponse;
};
type GetV1DiscountsResponse = GetV1DiscountsResponses[keyof GetV1DiscountsResponses];
type PostV1DiscountsData = {
    body?: {
        code: string;
        type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'bxgy';
        value: number;
        starts_at?: string;
        end_at?: string;
        usage_limit_total?: number;
        conditions?: string;
    };
    path?: never;
    query?: never;
    url: '/v1/discounts';
};
type PostV1DiscountsResponses = {
    /**
     * The created discount code
     */
    201: DiscountCode;
};
type PostV1DiscountsResponse = PostV1DiscountsResponses[keyof PostV1DiscountsResponses];
type PostV1DiscountsValidateData = {
    body?: {
        code: string;
        cart_total?: number;
        cart_quantity?: number;
        customer_tier?: string;
    };
    path?: never;
    query?: never;
    url: '/v1/discounts/validate';
};
type PostV1DiscountsValidateResponses = {
    /**
     * Validation result
     */
    200: DiscountValidation;
};
type PostV1DiscountsValidateResponse = PostV1DiscountsValidateResponses[keyof PostV1DiscountsValidateResponses];
type PostV1ApprovalsByApprovalIdExecuteData = {
    body?: never;
    path: {
        /**
         * Approval ID
         */
        approvalId: string;
    };
    query?: never;
    url: '/v1/approvals/{approvalId}/execute';
};
type PostV1ApprovalsByApprovalIdExecuteResponses = {
    /**
     * Approval executed successfully
     */
    200: SuccessResponse;
};
type PostV1ApprovalsByApprovalIdExecuteResponse = PostV1ApprovalsByApprovalIdExecuteResponses[keyof PostV1ApprovalsByApprovalIdExecuteResponses];
type PostV1ApprovalsByApprovalIdRejectData = {
    body?: {
        reason?: string;
    };
    path: {
        /**
         * Approval ID
         */
        approvalId: string;
    };
    query?: never;
    url: '/v1/approvals/{approvalId}/reject';
};
type PostV1ApprovalsByApprovalIdRejectResponses = {
    /**
     * Approval rejected successfully
     */
    200: SuccessResponse;
};
type PostV1ApprovalsByApprovalIdRejectResponse = PostV1ApprovalsByApprovalIdRejectResponses[keyof PostV1ApprovalsByApprovalIdRejectResponses];
type GetV1UtilsGeocodeData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Address to geocode
         */
        address: string;
    };
    url: '/v1/utils/geocode';
};
type GetV1UtilsGeocodeResponses = {
    /**
     * Geocode result
     */
    200: GeocodeResult;
};
type GetV1UtilsGeocodeResponse = GetV1UtilsGeocodeResponses[keyof GetV1UtilsGeocodeResponses];

type AuthToken = string | undefined;
interface Auth {
    /**
     * Which part of the request do we use to send the auth?
     *
     * @default 'header'
     */
    in?: 'header' | 'query' | 'cookie';
    /**
     * Header or query parameter name.
     *
     * @default 'Authorization'
     */
    name?: string;
    scheme?: 'basic' | 'bearer';
    type: 'apiKey' | 'http';
}

interface SerializerOptions<T> {
    /**
     * @default true
     */
    explode: boolean;
    style: T;
}
type ArrayStyle = 'form' | 'spaceDelimited' | 'pipeDelimited';
type ObjectStyle = 'form' | 'deepObject';

type QuerySerializer = (query: Record<string, unknown>) => string;
type BodySerializer = (body: unknown) => unknown;
type QuerySerializerOptionsObject = {
    allowReserved?: boolean;
    array?: Partial<SerializerOptions<ArrayStyle>>;
    object?: Partial<SerializerOptions<ObjectStyle>>;
};
type QuerySerializerOptions = QuerySerializerOptionsObject & {
    /**
     * Per-parameter serialization overrides. When provided, these settings
     * override the global array/object settings for specific parameter names.
     */
    parameters?: Record<string, QuerySerializerOptionsObject>;
};

type HttpMethod = 'connect' | 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace';
type Client$1<RequestFn = never, Config = unknown, MethodFn = never, BuildUrlFn = never, SseFn = never> = {
    /**
     * Returns the final request URL.
     */
    buildUrl: BuildUrlFn;
    getConfig: () => Config;
    request: RequestFn;
    setConfig: (config: Config) => Config;
} & {
    [K in HttpMethod]: MethodFn;
} & ([SseFn] extends [never] ? {
    sse?: never;
} : {
    sse: {
        [K in HttpMethod]: SseFn;
    };
});
interface Config$1 {
    /**
     * Auth token or a function returning auth token. The resolved value will be
     * added to the request payload as defined by its `security` array.
     */
    auth?: ((auth: Auth) => Promise<AuthToken> | AuthToken) | AuthToken;
    /**
     * A function for serializing request body parameter. By default,
     * {@link JSON.stringify()} will be used.
     */
    bodySerializer?: BodySerializer | null;
    /**
     * An object containing any HTTP headers that you want to pre-populate your
     * `Headers` object with.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init See more}
     */
    headers?: RequestInit['headers'] | Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined | unknown>;
    /**
     * The request method.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/fetch#method See more}
     */
    method?: Uppercase<HttpMethod>;
    /**
     * A function for serializing request query parameters. By default, arrays
     * will be exploded in form style, objects will be exploded in deepObject
     * style, and reserved characters are percent-encoded.
     *
     * This method will have no effect if the native `paramsSerializer()` Axios
     * API function is used.
     *
     * {@link https://swagger.io/docs/specification/serialization/#query View examples}
     */
    querySerializer?: QuerySerializer | QuerySerializerOptions;
    /**
     * A function validating request data. This is useful if you want to ensure
     * the request conforms to the desired shape, so it can be safely sent to
     * the server.
     */
    requestValidator?: (data: unknown) => Promise<unknown>;
    /**
     * A function transforming response data before it's returned. This is useful
     * for post-processing data, e.g., converting ISO strings into Date objects.
     */
    responseTransformer?: (data: unknown) => Promise<unknown>;
    /**
     * A function validating response data. This is useful if you want to ensure
     * the response conforms to the desired shape, so it can be safely passed to
     * the transformers and returned to the user.
     */
    responseValidator?: (data: unknown) => Promise<unknown>;
}

type ServerSentEventsOptions<TData = unknown> = Omit<RequestInit, 'method'> & Pick<Config$1, 'method' | 'responseTransformer' | 'responseValidator'> & {
    /**
     * Fetch API implementation. You can use this option to provide a custom
     * fetch instance.
     *
     * @default globalThis.fetch
     */
    fetch?: typeof fetch;
    /**
     * Implementing clients can call request interceptors inside this hook.
     */
    onRequest?: (url: string, init: RequestInit) => Promise<Request>;
    /**
     * Callback invoked when a network or parsing error occurs during streaming.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @param error The error that occurred.
     */
    onSseError?: (error: unknown) => void;
    /**
     * Callback invoked when an event is streamed from the server.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @param event Event streamed from the server.
     * @returns Nothing (void).
     */
    onSseEvent?: (event: StreamEvent<TData>) => void;
    serializedBody?: RequestInit['body'];
    /**
     * Default retry delay in milliseconds.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @default 3000
     */
    sseDefaultRetryDelay?: number;
    /**
     * Maximum number of retry attempts before giving up.
     */
    sseMaxRetryAttempts?: number;
    /**
     * Maximum retry delay in milliseconds.
     *
     * Applies only when exponential backoff is used.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @default 30000
     */
    sseMaxRetryDelay?: number;
    /**
     * Optional sleep function for retry backoff.
     *
     * Defaults to using `setTimeout`.
     */
    sseSleepFn?: (ms: number) => Promise<void>;
    url: string;
};
interface StreamEvent<TData = unknown> {
    data: TData;
    event?: string;
    id?: string;
    retry?: number;
}
type ServerSentEventsResult<TData = unknown, TReturn = void, TNext = unknown> = {
    stream: AsyncGenerator<TData extends Record<string, unknown> ? TData[keyof TData] : TData, TReturn, TNext>;
};

type ErrInterceptor<Err, Res, Req, Options> = (error: Err, 
/** response may be undefined due to a network error where no response object is produced */
response: Res | undefined, 
/** request may be undefined, because error may be from building the request object itself */
request: Req | undefined, options: Options) => Err | Promise<Err>;
type ReqInterceptor<Req, Options> = (request: Req, options: Options) => Req | Promise<Req>;
type ResInterceptor<Res, Req, Options> = (response: Res, request: Req, options: Options) => Res | Promise<Res>;
declare class Interceptors<Interceptor> {
    fns: Array<Interceptor | null>;
    clear(): void;
    eject(id: number | Interceptor): void;
    exists(id: number | Interceptor): boolean;
    getInterceptorIndex(id: number | Interceptor): number;
    update(id: number | Interceptor, fn: Interceptor): number | Interceptor | false;
    use(fn: Interceptor): number;
}
interface Middleware<Req, Res, Err, Options> {
    error: Interceptors<ErrInterceptor<Err, Res, Req, Options>>;
    request: Interceptors<ReqInterceptor<Req, Options>>;
    response: Interceptors<ResInterceptor<Res, Req, Options>>;
}

type ResponseStyle = 'data' | 'fields';
interface Config<T extends ClientOptions = ClientOptions> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Config$1 {
    /**
     * Base URL for all requests made by this client.
     */
    baseUrl?: T['baseUrl'];
    /**
     * Fetch API implementation. You can use this option to provide a custom
     * fetch instance.
     *
     * @default globalThis.fetch
     */
    fetch?: typeof fetch;
    /**
     * Please don't use the Fetch client for Next.js applications. The `next`
     * options won't have any effect.
     *
     * Install {@link https://www.npmjs.com/package/@hey-api/client-next `@hey-api/client-next`} instead.
     */
    next?: never;
    /**
     * Return the response data parsed in a specified format. By default, `auto`
     * will infer the appropriate method from the `Content-Type` response header.
     * You can override this behavior with any of the {@link Body} methods.
     * Select `stream` if you don't want to parse response data at all.
     *
     * @default 'auto'
     */
    parseAs?: 'arrayBuffer' | 'auto' | 'blob' | 'formData' | 'json' | 'stream' | 'text';
    /**
     * Should we return only data or multiple fields (data, error, response, etc.)?
     *
     * @default 'fields'
     */
    responseStyle?: ResponseStyle;
    /**
     * Throw an error instead of returning it in the response?
     *
     * @default false
     */
    throwOnError?: T['throwOnError'];
}
interface RequestOptions<TData = unknown, TResponseStyle extends ResponseStyle = 'fields', ThrowOnError extends boolean = boolean, Url extends string = string> extends Config<{
    responseStyle: TResponseStyle;
    throwOnError: ThrowOnError;
}>, Pick<ServerSentEventsOptions<TData>, 'onRequest' | 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
    /**
     * Any body that you want to add to your request.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
     */
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    /**
     * Security mechanism(s) to use for the request.
     */
    security?: ReadonlyArray<Auth>;
    url: Url;
}
interface ResolvedRequestOptions<TResponseStyle extends ResponseStyle = 'fields', ThrowOnError extends boolean = boolean, Url extends string = string> extends RequestOptions<unknown, TResponseStyle, ThrowOnError, Url> {
    headers: Headers;
    serializedBody?: string;
}
type RequestResult<TData = unknown, TError = unknown, ThrowOnError extends boolean = boolean, TResponseStyle extends ResponseStyle = 'fields'> = ThrowOnError extends true ? Promise<TResponseStyle extends 'data' ? TData extends Record<string, unknown> ? TData[keyof TData] : TData : {
    data: TData extends Record<string, unknown> ? TData[keyof TData] : TData;
    request: Request;
    response: Response;
}> : Promise<TResponseStyle extends 'data' ? (TData extends Record<string, unknown> ? TData[keyof TData] : TData) | undefined : ({
    data: TData extends Record<string, unknown> ? TData[keyof TData] : TData;
    error: undefined;
} | {
    data: undefined;
    error: TError extends Record<string, unknown> ? TError[keyof TError] : TError;
}) & {
    /** request may be undefined, because error may be from building the request object itself */
    request?: Request;
    /** response may be undefined, because error may be from building the request object itself or from a network error */
    response?: Response;
}>;
interface ClientOptions {
    baseUrl?: string;
    responseStyle?: ResponseStyle;
    throwOnError?: boolean;
}
type MethodFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;
type SseFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<never, TResponseStyle, ThrowOnError>, 'method'>) => Promise<ServerSentEventsResult<TData, TError>>;
type RequestFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'> & Pick<Required<RequestOptions<TData, TResponseStyle, ThrowOnError>>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;
type BuildUrlFn = <TData extends {
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    url: string;
}>(options: TData & Options$1<TData>) => string;
type Client = Client$1<RequestFn, Config, MethodFn, BuildUrlFn, SseFn> & {
    interceptors: Middleware<Request, Response, unknown, ResolvedRequestOptions>;
};
interface TDataShape {
    body?: unknown;
    headers?: unknown;
    path?: unknown;
    query?: unknown;
    url: string;
}
type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;
type Options$1<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean, TResponse = unknown, TResponseStyle extends ResponseStyle = 'fields'> = OmitKeys<RequestOptions<TResponse, TResponseStyle, ThrowOnError>, 'body' | 'path' | 'query' | 'url'> & ([TData] extends [never] ? unknown : Omit<TData, 'url'>);

type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean, TResponse = unknown> = Options$1<TData, ThrowOnError, TResponse> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};
/**
 * Retrieve a list of products
 *
 * List products
 */
declare const getV1Products: <ThrowOnError extends boolean = false>(options?: Options<GetV1ProductsData, ThrowOnError>) => RequestResult<GetV1ProductsResponses, unknown, ThrowOnError, "fields">;
/**
 * Retrieve a product by ID
 *
 * Get a single product
 */
declare const getV1ProductsById: <ThrowOnError extends boolean = false>(options: Options<GetV1ProductsByIdData, ThrowOnError>) => RequestResult<GetV1ProductsByIdResponses, GetV1ProductsByIdErrors, ThrowOnError, "fields">;
/**
 * Create a cart
 *
 * Create a new cart
 */
declare const postV1Carts: <ThrowOnError extends boolean = false>(options?: Options<PostV1CartsData, ThrowOnError>) => RequestResult<PostV1CartsResponses, unknown, ThrowOnError, "fields">;
/**
 * Get cart
 *
 * Get cart by ID
 */
declare const getV1CartsById: <ThrowOnError extends boolean = false>(options: Options<GetV1CartsByIdData, ThrowOnError>) => RequestResult<GetV1CartsByIdResponses, GetV1CartsByIdErrors, ThrowOnError, "fields">;
/**
 * Add cart items
 *
 * Add items to cart
 */
declare const postV1CartsByIdItems: <ThrowOnError extends boolean = false>(options: Options<PostV1CartsByIdItemsData, ThrowOnError>) => RequestResult<PostV1CartsByIdItemsResponses, PostV1CartsByIdItemsErrors, ThrowOnError, "fields">;
/**
 * Remove cart item
 *
 * Remove item from cart
 */
declare const deleteV1CartsByIdItemsByLineId: <ThrowOnError extends boolean = false>(options: Options<DeleteV1CartsByIdItemsByLineIdData, ThrowOnError>) => RequestResult<DeleteV1CartsByIdItemsByLineIdResponses, DeleteV1CartsByIdItemsByLineIdErrors, ThrowOnError, "fields">;
/**
 * Update cart item
 *
 * Update cart item quantity
 */
declare const putV1CartsByIdItemsByLineId: <ThrowOnError extends boolean = false>(options: Options<PutV1CartsByIdItemsByLineIdData, ThrowOnError>) => RequestResult<PutV1CartsByIdItemsByLineIdResponses, PutV1CartsByIdItemsByLineIdErrors, ThrowOnError, "fields">;
/**
 * Update shipping address
 *
 * Update shipping address of an order
 */
declare const patchV1OrdersByOrderIdShippingAddress: <ThrowOnError extends boolean = false>(options: Options<PatchV1OrdersByOrderIdShippingAddressData, ThrowOnError>) => RequestResult<PatchV1OrdersByOrderIdShippingAddressResponses, PatchV1OrdersByOrderIdShippingAddressErrors, ThrowOnError, "fields">;
/**
 * Resend confirmation
 *
 * Resend order confirmation email
 */
declare const postV1OrdersByOrderIdResendConfirmation: <ThrowOnError extends boolean = false>(options: Options<PostV1OrdersByOrderIdResendConfirmationData, ThrowOnError>) => RequestResult<PostV1OrdersByOrderIdResendConfirmationResponses, PostV1OrdersByOrderIdResendConfirmationErrors, ThrowOnError, "fields">;
/**
 * Resend invoice
 *
 * Resend invoice email with PDF link
 */
declare const postV1OrdersByOrderIdResendInvoice: <ThrowOnError extends boolean = false>(options: Options<PostV1OrdersByOrderIdResendInvoiceData, ThrowOnError>) => RequestResult<PostV1OrdersByOrderIdResendInvoiceResponses, PostV1OrdersByOrderIdResendInvoiceErrors, ThrowOnError, "fields">;
/**
 * Cancel order
 *
 * Cancel an order and refund if necessary
 */
declare const postV1OrdersByOrderIdCancel: <ThrowOnError extends boolean = false>(options: Options<PostV1OrdersByOrderIdCancelData, ThrowOnError>) => RequestResult<PostV1OrdersByOrderIdCancelResponses, PostV1OrdersByOrderIdCancelErrors, ThrowOnError, "fields">;
/**
 * Retrieve a list of collections
 *
 * List collections
 */
declare const getV1Collections: <ThrowOnError extends boolean = false>(options?: Options<GetV1CollectionsData, ThrowOnError>) => RequestResult<GetV1CollectionsResponses, unknown, ThrowOnError, "fields">;
/**
 * Create checkout
 *
 * Create a Stripe Checkout session
 */
declare const postV1CheckoutStripe: <ThrowOnError extends boolean = false>(options?: Options<PostV1CheckoutStripeData, ThrowOnError>) => RequestResult<PostV1CheckoutStripeResponses, unknown, ThrowOnError, "fields">;
/**
 * Retrieve a list of orders
 *
 * List orders
 */
declare const getV1Orders: <ThrowOnError extends boolean = false>(options?: Options<GetV1OrdersData, ThrowOnError>) => RequestResult<GetV1OrdersResponses, unknown, ThrowOnError, "fields">;
/**
 * Fulfill order
 *
 * Fulfill an order and optionally add tracking info
 */
declare const postV1OrdersByOrderIdFulfill: <ThrowOnError extends boolean = false>(options: Options<PostV1OrdersByOrderIdFulfillData, ThrowOnError>) => RequestResult<PostV1OrdersByOrderIdFulfillResponses, unknown, ThrowOnError, "fields">;
/**
 * Refund order
 *
 * Refund an order fully or partially
 */
declare const postV1OrdersByOrderIdRefund: <ThrowOnError extends boolean = false>(options: Options<PostV1OrdersByOrderIdRefundData, ThrowOnError>) => RequestResult<PostV1OrdersByOrderIdRefundResponses, unknown, ThrowOnError, "fields">;
/**
 * Get inventory
 *
 * Get inventory levels
 */
declare const getV1Inventory: <ThrowOnError extends boolean = false>(options?: Options<GetV1InventoryData, ThrowOnError>) => RequestResult<GetV1InventoryResponses, unknown, ThrowOnError, "fields">;
/**
 * Update inventory
 *
 * Update inventory level for a variant
 */
declare const postV1Inventory: <ThrowOnError extends boolean = false>(options?: Options<PostV1InventoryData, ThrowOnError>) => RequestResult<PostV1InventoryResponses, unknown, ThrowOnError, "fields">;
/**
 * Get loyalty balance
 *
 * Get loyalty point balance for a contact
 */
declare const getV1Loyalty: <ThrowOnError extends boolean = false>(options: Options<GetV1LoyaltyData, ThrowOnError>) => RequestResult<GetV1LoyaltyResponses, unknown, ThrowOnError, "fields">;
/**
 * Redeem loyalty points
 *
 * Redeem loyalty points
 */
declare const postV1LoyaltyRedeem: <ThrowOnError extends boolean = false>(options?: Options<PostV1LoyaltyRedeemData, ThrowOnError>) => RequestResult<PostV1LoyaltyRedeemResponses, unknown, ThrowOnError, "fields">;
/**
 * Get referral info
 *
 * Get referral info for a contact
 */
declare const getV1LoyaltyReferral: <ThrowOnError extends boolean = false>(options: Options<GetV1LoyaltyReferralData, ThrowOnError>) => RequestResult<GetV1LoyaltyReferralResponses, unknown, ThrowOnError, "fields">;
/**
 * List gift cards
 *
 * List gift cards
 */
declare const getV1GiftCards: <ThrowOnError extends boolean = false>(options?: Options<GetV1GiftCardsData, ThrowOnError>) => RequestResult<GetV1GiftCardsResponses, unknown, ThrowOnError, "fields">;
/**
 * Create gift card
 *
 * Create a new gift card
 */
declare const postV1GiftCards: <ThrowOnError extends boolean = false>(options?: Options<PostV1GiftCardsData, ThrowOnError>) => RequestResult<PostV1GiftCardsResponses, unknown, ThrowOnError, "fields">;
/**
 * Redeem gift card
 *
 * Redeem a gift card
 */
declare const postV1GiftCardsRedeem: <ThrowOnError extends boolean = false>(options?: Options<PostV1GiftCardsRedeemData, ThrowOnError>) => RequestResult<PostV1GiftCardsRedeemResponses, unknown, ThrowOnError, "fields">;
/**
 * Update subscription
 *
 * Update a subscription (delay or ship now)
 */
declare const patchV1SubscriptionsBySubscriptionId: <ThrowOnError extends boolean = false>(options: Options<PatchV1SubscriptionsBySubscriptionIdData, ThrowOnError>) => RequestResult<PatchV1SubscriptionsBySubscriptionIdResponses, unknown, ThrowOnError, "fields">;
/**
 * List tickets
 *
 * List support tickets
 */
declare const getV1Tickets: <ThrowOnError extends boolean = false>(options?: Options<GetV1TicketsData, ThrowOnError>) => RequestResult<GetV1TicketsResponses, unknown, ThrowOnError, "fields">;
/**
 * Create ticket
 *
 * Create a new support ticket
 */
declare const postV1Tickets: <ThrowOnError extends boolean = false>(options?: Options<PostV1TicketsData, ThrowOnError>) => RequestResult<PostV1TicketsResponses, unknown, ThrowOnError, "fields">;
/**
 * Get ticket
 *
 * Get a single support ticket
 */
declare const getV1TicketsById: <ThrowOnError extends boolean = false>(options: Options<GetV1TicketsByIdData, ThrowOnError>) => RequestResult<GetV1TicketsByIdResponses, GetV1TicketsByIdErrors, ThrowOnError, "fields">;
/**
 * Reply to ticket
 *
 * Reply to a support ticket
 */
declare const postV1TicketsByIdReply: <ThrowOnError extends boolean = false>(options: Options<PostV1TicketsByIdReplyData, ThrowOnError>) => RequestResult<PostV1TicketsByIdReplyResponses, unknown, ThrowOnError, "fields">;
/**
 * List discounts
 *
 * List discount codes
 */
declare const getV1Discounts: <ThrowOnError extends boolean = false>(options?: Options<GetV1DiscountsData, ThrowOnError>) => RequestResult<GetV1DiscountsResponses, unknown, ThrowOnError, "fields">;
/**
 * Create discount code
 *
 * Create a new discount code
 */
declare const postV1Discounts: <ThrowOnError extends boolean = false>(options?: Options<PostV1DiscountsData, ThrowOnError>) => RequestResult<PostV1DiscountsResponses, unknown, ThrowOnError, "fields">;
/**
 * Validate discount code
 *
 * Validate a discount code against cart context
 */
declare const postV1DiscountsValidate: <ThrowOnError extends boolean = false>(options?: Options<PostV1DiscountsValidateData, ThrowOnError>) => RequestResult<PostV1DiscountsValidateResponses, unknown, ThrowOnError, "fields">;
/**
 * Execute approval
 *
 * Execute a pending approval
 */
declare const postV1ApprovalsByApprovalIdExecute: <ThrowOnError extends boolean = false>(options: Options<PostV1ApprovalsByApprovalIdExecuteData, ThrowOnError>) => RequestResult<PostV1ApprovalsByApprovalIdExecuteResponses, unknown, ThrowOnError, "fields">;
/**
 * Reject approval
 *
 * Reject a pending approval
 */
declare const postV1ApprovalsByApprovalIdReject: <ThrowOnError extends boolean = false>(options: Options<PostV1ApprovalsByApprovalIdRejectData, ThrowOnError>) => RequestResult<PostV1ApprovalsByApprovalIdRejectResponses, unknown, ThrowOnError, "fields">;
/**
 * Geocode address
 *
 * Geocode an address to coordinates
 */
declare const getV1UtilsGeocode: <ThrowOnError extends boolean = false>(options: Options<GetV1UtilsGeocodeData, ThrowOnError>) => RequestResult<GetV1UtilsGeocodeResponses, unknown, ThrowOnError, "fields">;

declare const client: Client;

interface ReponseOptions {
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
declare class Reponse {
    constructor(options: ReponseOptions);
    /** Product catalog operations: list, search, and retrieve products and collections. */
    catalog: {
        /**
         * List products from the catalog.
         * @param params.query.limit - Number of products to return (1-100, default 50)
         * @param params.query.cursor - Cursor for pagination
         * @param params.query.query - Search query to filter by title
         * @param params.query.slug - Filter by product slug/handle
         * @returns Paginated list of products with variants and pricing
         */
        listProducts: (params?: Parameters<typeof getV1Products>[0]) => Promise<{
            data: ProductListResponse;
            request: Request;
            response: Response;
        } | (({
            data: ProductListResponse;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Get a single product by its ID with full details (variants, images, pricing).
         * @param params.path.id - The UUID of the product
         */
        getProduct: (params: Parameters<typeof getV1ProductsById>[0]) => Promise<{
            data: Product;
            request: Request;
            response: Response;
        } | (({
            data: Product;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * List all product collections/categories.
         * @param params.query.limit - Number of collections to return (default 50)
         */
        listCollections: (params?: Parameters<typeof getV1Collections>[0]) => Promise<{
            data: CollectionListResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: CollectionListResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Shopping cart operations: create, read, add/update/remove items. */
    cart: {
        /**
         * Create a new shopping cart.
         * @param params.body.currency - Currency code (default EUR)
         * @param params.body.items - Optional initial items to add
         */
        create: (params?: Parameters<typeof postV1Carts>[0]) => Promise<{
            data: Cart;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: Cart;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Get an existing cart by ID with items and totals.
         * @param params.path.id - The UUID of the cart
         */
        get: (params: Parameters<typeof getV1CartsById>[0]) => Promise<{
            data: Cart;
            request: Request;
            response: Response;
        } | (({
            data: Cart;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Add items to an existing cart.
         * @param params.path.id - Cart UUID
         * @param params.body.items - Array of { product_id, variant_id?, quantity }
         */
        addItem: (params: Parameters<typeof postV1CartsByIdItems>[0]) => Promise<{
            data: unknown;
            request: Request;
            response: Response;
        } | (({
            data: unknown;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Update the quantity of a cart line item. Set quantity to 0 to remove.
         * @param params.path.id - Cart UUID
         * @param params.path.lineId - Line item UUID
         * @param params.body.quantity - New quantity
         */
        updateItem: (params: Parameters<typeof putV1CartsByIdItemsByLineId>[0]) => Promise<{
            data: unknown;
            request: Request;
            response: Response;
        } | (({
            data: unknown;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Remove an item from a cart completely.
         * @param params.path.id - Cart UUID
         * @param params.path.lineId - Line item UUID to remove
         */
        removeItem: (params: Parameters<typeof deleteV1CartsByIdItemsByLineId>[0]) => Promise<{
            data: unknown;
            request: Request;
            response: Response;
        } | (({
            data: unknown;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Create a Stripe Checkout session for a cart. Returns a redirect URL.
         * @param params.body.cart_id - Cart UUID
         * @param params.body.success_url - Redirect URL after successful payment
         * @param params.body.cancel_url - Redirect URL if payment is cancelled
         */
        createCheckout: (params?: Parameters<typeof postV1CheckoutStripe>[0]) => Promise<{
            data: CheckoutSession;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: CheckoutSession;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Order management: list, fulfill, refund, cancel, and notifications. */
    orders: {
        /**
         * List orders with optional status filter.
         * @param params.query.status - Filter by status (paid, fulfilled, shipped, cancelled, refunded)
         * @param params.query.limit - Number of orders to return (default 50)
         */
        list: (params?: Parameters<typeof getV1Orders>[0]) => Promise<{
            data: OrderListResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: OrderListResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Mark an order as fulfilled and optionally attach tracking info.
         * @param params.path.orderId - Order UUID
         * @param params.body.tracking_number - Shipment tracking number
         * @param params.body.tracking_company - Carrier name
         * @param params.body.tracking_url - Tracking URL
         * @param params.body.send_email - Send notification email (default true)
         */
        fulfill: (params: Parameters<typeof postV1OrdersByOrderIdFulfill>[0]) => Promise<{
            data: SuccessResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: SuccessResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Refund an order (full or partial).
         * @param params.path.orderId - Order UUID
         * @param params.body.amount - Partial refund amount (omit for full refund)
         * @param params.body.reason - Reason for the refund
         */
        refund: (params: Parameters<typeof postV1OrdersByOrderIdRefund>[0]) => Promise<{
            data: SuccessResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: SuccessResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Update the shipping address of an existing order.
         * @param params.path.orderId - Order UUID
         * @param params.body.shipping_address - New address object
         * @param params.body.conversation_id - Conversation UUID for identity verification
         */
        updateShippingAddress: (params: Parameters<typeof patchV1OrdersByOrderIdShippingAddress>[0]) => Promise<{
            data: {
                success: boolean;
                confirmation_message?: string;
                notify_merchant?: boolean;
                event_id?: string;
            };
            request: Request;
            response: Response;
        } | (({
            data: {
                success: boolean;
                confirmation_message?: string;
                notify_merchant?: boolean;
                event_id?: string;
            };
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Resend the order confirmation email. Rate limited: max 3 per hour.
         * @param params.path.orderId - Order UUID
         * @param params.body.conversation_id - Conversation UUID for identity verification
         */
        resendConfirmation: (params: Parameters<typeof postV1OrdersByOrderIdResendConfirmation>[0]) => Promise<{
            data: {
                success: boolean;
                confirmation_message?: string;
                event_id?: string;
            };
            request: Request;
            response: Response;
        } | (({
            data: {
                success: boolean;
                confirmation_message?: string;
                event_id?: string;
            };
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Resend the invoice email with PDF. Rate limited: max 3 per hour.
         * @param params.path.orderId - Order UUID
         * @param params.body.conversation_id - Conversation UUID for identity verification
         */
        resendInvoice: (params: Parameters<typeof postV1OrdersByOrderIdResendInvoice>[0]) => Promise<{
            data: {
                success: boolean;
                confirmation_message?: string;
                event_id?: string;
            };
            request: Request;
            response: Response;
        } | (({
            data: {
                success: boolean;
                confirmation_message?: string;
                event_id?: string;
            };
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Cancel an order and trigger a Stripe refund.
         * @param params.path.orderId - Order UUID
         * @param params.body.reason - Cancellation reason enum
         * @param params.body.conversation_id - Conversation UUID for identity verification
         */
        cancel: (params: Parameters<typeof postV1OrdersByOrderIdCancel>[0]) => Promise<{
            data: unknown;
            request: Request;
            response: Response;
        } | (({
            data: unknown;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Inventory management: check and update stock levels. */
    inventory: {
        /**
         * Get current inventory levels for a variant, SKU, or product.
         * @param params.query.variant_id - Variant UUID
         * @param params.query.sku - Product/variant SKU
         * @param params.query.product_id - Product UUID
         */
        get: (params?: Parameters<typeof getV1Inventory>[0]) => Promise<{
            data: InventoryLevel;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: InventoryLevel;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Set or adjust inventory quantity for a variant.
         * @param params.body.variant_id - Variant UUID
         * @param params.body.quantity - Quantity value
         * @param params.body.mode - 'set' to replace, 'adjust' to add/subtract
         * @param params.body.reason - Reason for the change
         */
        update: (params?: Parameters<typeof postV1Inventory>[0]) => Promise<{
            data: InventoryLevel;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: InventoryLevel;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Discount code operations: list, create, and validate promo codes. */
    discounts: {
        /**
         * List discount codes. Filter by active status or type.
         * @param params.query.active - Filter by active status
         * @param params.query.type - Filter by type (percentage, fixed_amount, free_shipping, bxgy)
         */
        list: (params?: Parameters<typeof getV1Discounts>[0]) => Promise<{
            data: DiscountListResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: DiscountListResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Validate a discount code and calculate potential savings.
         * @param params.body.code - The discount code to validate
         * @param params.body.cart_total - Cart total for savings calculation
         * @param params.body.cart_quantity - Number of items in cart
         */
        validate: (params?: Parameters<typeof postV1DiscountsValidate>[0]) => Promise<{
            data: DiscountValidation;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: DiscountValidation;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Create a new discount code.
         * @param params.body.code - Code text (will be uppercased)
         * @param params.body.type - Type: percentage, fixed_amount, free_shipping, bxgy
         * @param params.body.value - Discount value
         */
        create: (params?: Parameters<typeof postV1Discounts>[0]) => Promise<{
            data: DiscountCode;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: DiscountCode;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Loyalty program: points balance, redemption, and referrals. */
    loyalty: {
        /**
         * Get the loyalty points balance for a contact.
         * @param params.query.contact_id - Contact UUID
         */
        getBalance: (params: Parameters<typeof getV1Loyalty>[0]) => Promise<{
            data: LoyaltyBalance;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: LoyaltyBalance;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Redeem loyalty points, optionally against a specific order.
         * @param params.body.contact_id - Contact UUID
         * @param params.body.points - Number of points to redeem
         * @param params.body.order_id - Order UUID to apply the redemption to
         */
        redeem: (params?: Parameters<typeof postV1LoyaltyRedeem>[0]) => Promise<{
            data: SuccessResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: SuccessResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Get referral program info for a contact (link, stats, rewards).
         * @param params.query.contact_id - Contact UUID
         */
        getReferralInfo: (params: Parameters<typeof getV1LoyaltyReferral>[0]) => Promise<{
            data: ReferralInfo;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: ReferralInfo;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Gift card operations: list, create, and redeem gift cards. */
    giftCards: {
        /**
         * List gift cards in the workspace.
         * @param params.query.limit - Number to return (default 50)
         */
        list: (params?: Parameters<typeof getV1GiftCards>[0]) => Promise<{
            data: GiftCardListResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: GiftCardListResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Create a new gift card with an initial monetary value.
         * @param params.body.initial_value - Initial value
         * @param params.body.currency - Currency code (default EUR)
         * @param params.body.code - Custom code (auto-generated if omitted)
         * @param params.body.expires_at - Expiration date (ISO 8601)
         */
        create: (params?: Parameters<typeof postV1GiftCards>[0]) => Promise<{
            data: GiftCard;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: GiftCard;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Redeem a gift card by applying an amount against it.
         * @param params.body.code - Gift card code
         * @param params.body.amount - Amount to redeem
         * @param params.body.order_id - Order UUID to apply to
         */
        redeem: (params?: Parameters<typeof postV1GiftCardsRedeem>[0]) => Promise<{
            data: SuccessResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: SuccessResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Support ticket operations: list, create, read, and reply. */
    tickets: {
        /**
         * List support tickets with optional filters.
         * @param params.query.status - Filter by status (open, pending_customer, resolved, archived)
         * @param params.query.category - Filter by category
         * @param params.query.customer_email - Filter by customer email
         * @param params.query.limit - Number to return (default 20)
         */
        list: (params?: Parameters<typeof getV1Tickets>[0]) => Promise<{
            data: TicketListResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: TicketListResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Get a single ticket by ID with full details.
         * @param params.path.id - Ticket UUID
         */
        get: (params: Parameters<typeof getV1TicketsById>[0]) => Promise<{
            data: Ticket;
            request: Request;
            response: Response;
        } | (({
            data: Ticket;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Create a new support ticket.
         * @param params.body.customer_email - Customer email
         * @param params.body.subject - Ticket subject
         * @param params.body.message - Initial message body
         * @param params.body.category - Ticket category
         * @param params.body.order_id - Related order UUID
         */
        create: (params?: Parameters<typeof postV1Tickets>[0]) => Promise<{
            data: Ticket;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: Ticket;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Reply to a support ticket.
         * @param params.path.id - Ticket UUID
         * @param params.body.message - Reply message body
         */
        reply: (params: Parameters<typeof postV1TicketsByIdReply>[0]) => Promise<{
            data: SuccessResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: SuccessResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Subscription management: delay or trigger shipments. */
    subscriptions: {
        /**
         * Update a subscription — delay next shipment or trigger immediate shipment.
         * @param params.path.subscriptionId - Subscription UUID
         * @param params.body.action - 'delay' or 'ship_now'
         * @param params.body.target_date - New date for delay action (ISO 8601)
         */
        update: (params: Parameters<typeof patchV1SubscriptionsBySubscriptionId>[0]) => Promise<{
            data: Subscription;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: Subscription;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Approval workflow: execute or reject pending approval requests. */
    approvals: {
        /**
         * Execute (approve) a pending approval request.
         * @param params.path.approvalId - Approval UUID
         */
        execute: (params: Parameters<typeof postV1ApprovalsByApprovalIdExecute>[0]) => Promise<{
            data: SuccessResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: SuccessResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Reject a pending approval request.
         * @param params.path.approvalId - Approval UUID
         * @param params.body.reason - Reason for rejection
         */
        reject: (params: Parameters<typeof postV1ApprovalsByApprovalIdReject>[0]) => Promise<{
            data: SuccessResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: SuccessResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Utility operations: geocoding and address resolution. */
    utils: {
        /**
         * Geocode a free-form address into coordinates and structured components.
         * @param params.query.address - The address string to geocode
         */
        geocodeAddress: (params: Parameters<typeof getV1UtilsGeocode>[0]) => Promise<{
            data: GeocodeResult;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: GeocodeResult;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
}

export { type AddCartItemInput, type Cart, type CheckoutSession, type ClientOptions$1 as ClientOptions, type Collection, type CollectionListResponse, type CreateCartInput, type CreateCheckoutInput, type DeleteV1CartsByIdItemsByLineIdData, type DeleteV1CartsByIdItemsByLineIdErrors, type DeleteV1CartsByIdItemsByLineIdResponses, type DiscountCode, type DiscountListResponse, type DiscountValidation, type GeocodeResult, type GetV1CartsByIdData, type GetV1CartsByIdErrors, type GetV1CartsByIdResponse, type GetV1CartsByIdResponses, type GetV1CollectionsData, type GetV1CollectionsResponse, type GetV1CollectionsResponses, type GetV1DiscountsData, type GetV1DiscountsResponse, type GetV1DiscountsResponses, type GetV1GiftCardsData, type GetV1GiftCardsResponse, type GetV1GiftCardsResponses, type GetV1InventoryData, type GetV1InventoryResponse, type GetV1InventoryResponses, type GetV1LoyaltyData, type GetV1LoyaltyReferralData, type GetV1LoyaltyReferralResponse, type GetV1LoyaltyReferralResponses, type GetV1LoyaltyResponse, type GetV1LoyaltyResponses, type GetV1OrdersData, type GetV1OrdersResponse, type GetV1OrdersResponses, type GetV1ProductsByIdData, type GetV1ProductsByIdErrors, type GetV1ProductsByIdResponse, type GetV1ProductsByIdResponses, type GetV1ProductsData, type GetV1ProductsResponse, type GetV1ProductsResponses, type GetV1TicketsByIdData, type GetV1TicketsByIdErrors, type GetV1TicketsByIdResponse, type GetV1TicketsByIdResponses, type GetV1TicketsData, type GetV1TicketsResponse, type GetV1TicketsResponses, type GetV1UtilsGeocodeData, type GetV1UtilsGeocodeResponse, type GetV1UtilsGeocodeResponses, type GiftCard, type GiftCardListResponse, type InventoryLevel, type LoyaltyBalance, type Options, type Order, type OrderListResponse, type PatchV1OrdersByOrderIdShippingAddressData, type PatchV1OrdersByOrderIdShippingAddressErrors, type PatchV1OrdersByOrderIdShippingAddressResponse, type PatchV1OrdersByOrderIdShippingAddressResponses, type PatchV1SubscriptionsBySubscriptionIdData, type PatchV1SubscriptionsBySubscriptionIdResponse, type PatchV1SubscriptionsBySubscriptionIdResponses, type PostV1ApprovalsByApprovalIdExecuteData, type PostV1ApprovalsByApprovalIdExecuteResponse, type PostV1ApprovalsByApprovalIdExecuteResponses, type PostV1ApprovalsByApprovalIdRejectData, type PostV1ApprovalsByApprovalIdRejectResponse, type PostV1ApprovalsByApprovalIdRejectResponses, type PostV1CartsByIdItemsData, type PostV1CartsByIdItemsErrors, type PostV1CartsByIdItemsResponses, type PostV1CartsData, type PostV1CartsResponse, type PostV1CartsResponses, type PostV1CheckoutStripeData, type PostV1CheckoutStripeResponse, type PostV1CheckoutStripeResponses, type PostV1DiscountsData, type PostV1DiscountsResponse, type PostV1DiscountsResponses, type PostV1DiscountsValidateData, type PostV1DiscountsValidateResponse, type PostV1DiscountsValidateResponses, type PostV1GiftCardsData, type PostV1GiftCardsRedeemData, type PostV1GiftCardsRedeemResponse, type PostV1GiftCardsRedeemResponses, type PostV1GiftCardsResponse, type PostV1GiftCardsResponses, type PostV1InventoryData, type PostV1InventoryResponse, type PostV1InventoryResponses, type PostV1LoyaltyRedeemData, type PostV1LoyaltyRedeemResponse, type PostV1LoyaltyRedeemResponses, type PostV1OrdersByOrderIdCancelData, type PostV1OrdersByOrderIdCancelErrors, type PostV1OrdersByOrderIdCancelResponses, type PostV1OrdersByOrderIdFulfillData, type PostV1OrdersByOrderIdFulfillResponse, type PostV1OrdersByOrderIdFulfillResponses, type PostV1OrdersByOrderIdRefundData, type PostV1OrdersByOrderIdRefundResponse, type PostV1OrdersByOrderIdRefundResponses, type PostV1OrdersByOrderIdResendConfirmationData, type PostV1OrdersByOrderIdResendConfirmationErrors, type PostV1OrdersByOrderIdResendConfirmationResponse, type PostV1OrdersByOrderIdResendConfirmationResponses, type PostV1OrdersByOrderIdResendInvoiceData, type PostV1OrdersByOrderIdResendInvoiceErrors, type PostV1OrdersByOrderIdResendInvoiceResponse, type PostV1OrdersByOrderIdResendInvoiceResponses, type PostV1TicketsByIdReplyData, type PostV1TicketsByIdReplyResponse, type PostV1TicketsByIdReplyResponses, type PostV1TicketsData, type PostV1TicketsResponse, type PostV1TicketsResponses, type Product, type ProductListResponse, type ProductVariant, type PutV1CartsByIdItemsByLineIdData, type PutV1CartsByIdItemsByLineIdErrors, type PutV1CartsByIdItemsByLineIdResponses, type ReferralInfo, Reponse, type ReponseOptions, type Subscription, type SuccessResponse, type Ticket, type TicketListResponse, type UpdateCartItemInput, client, deleteV1CartsByIdItemsByLineId, getV1CartsById, getV1Collections, getV1Discounts, getV1GiftCards, getV1Inventory, getV1Loyalty, getV1LoyaltyReferral, getV1Orders, getV1Products, getV1ProductsById, getV1Tickets, getV1TicketsById, getV1UtilsGeocode, patchV1OrdersByOrderIdShippingAddress, patchV1SubscriptionsBySubscriptionId, postV1ApprovalsByApprovalIdExecute, postV1ApprovalsByApprovalIdReject, postV1Carts, postV1CartsByIdItems, postV1CheckoutStripe, postV1Discounts, postV1DiscountsValidate, postV1GiftCards, postV1GiftCardsRedeem, postV1Inventory, postV1LoyaltyRedeem, postV1OrdersByOrderIdCancel, postV1OrdersByOrderIdFulfill, postV1OrdersByOrderIdRefund, postV1OrdersByOrderIdResendConfirmation, postV1OrdersByOrderIdResendInvoice, postV1Tickets, postV1TicketsByIdReply, putV1CartsByIdItemsByLineId };
