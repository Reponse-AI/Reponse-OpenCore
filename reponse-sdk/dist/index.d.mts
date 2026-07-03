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
    barcode?: string | null;
    option_values: Array<string> | null;
    position?: number;
    weight?: number | null;
    weight_unit?: string | null;
};
type ProductMetafield = {
    id: string;
    namespace: string;
    key: string;
    value: string | null;
    type: 'single_line_text' | 'multi_line_text' | 'number_integer' | 'number_decimal' | 'boolean' | 'json' | 'date' | 'url' | 'color' | 'dimension' | 'weight';
    createdAt?: string;
    updatedAt?: string;
};
type Product = {
    id: string;
    title: string;
    slug: string | null;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    vendor?: string | null;
    category_name?: string | null;
    google_product_category_path?: string | null;
    product_type?: string | null;
    tags?: Array<string>;
    price: number;
    compare_at_price: number | null;
    currency: string;
    in_stock: boolean;
    images: Array<string>;
    status: 'active' | 'draft' | 'archived';
    has_only_default_variant?: boolean;
    /**
     * Product option definitions (e.g. Size, Color)
     */
    option_definitions?: unknown;
    variants?: Array<ProductVariant>;
    /**
     * Included by default on detail, opt-in on list (?include=metafields)
     */
    metafields?: Array<ProductMetafield>;
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
type CollectionDetail = {
    id: string;
    title: string;
    handle: string;
    description: string | null;
    image_url: string | null;
    seo_title: string | null;
    seo_description: string | null;
    product_count: number;
};
type CollectionProductsResponse = {
    products: Array<Product>;
    total: number;
    limit: number;
    offset: number;
};
/**
 * CSS custom properties keyed by variable name (e.g. --rp-color-primary)
 */
type ThemeResponse = {
    [key: string]: string;
};
type ShippingRate = {
    rate_id: string;
    name: string;
    price: number;
    currency: string;
    delivery_estimate?: {
        min_days: number;
        max_days: number;
    };
    is_free: boolean;
};
type ShippingRatesResponse = {
    profiles: Array<{
        profile_id: string;
        profile_name: string;
        rates: Array<ShippingRate>;
    }>;
};
type Policy = {
    policy_type: 'privacy_policy' | 'terms_of_service' | 'refund_policy' | 'shipping_policy' | 'legal_notice';
    title: string;
    body: string;
    locale?: string;
    updated_at?: string;
    slug?: string;
    url?: string;
};
type PolicyListResponse = {
    data: Array<Policy>;
};
type PolicyDetailResponse = {
    data: Policy;
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
type GetV1CollectionsByHandleData = {
    body?: never;
    path: {
        /**
         * Collection handle (slug)
         */
        handle: string;
    };
    query?: never;
    url: '/v1/collections/{handle}';
};
type GetV1CollectionsByHandleErrors = {
    /**
     * Collection not found
     */
    404: unknown;
};
type GetV1CollectionsByHandleResponses = {
    /**
     * Collection details
     */
    200: {
        data: CollectionDetail;
    };
};
type GetV1CollectionsByHandleResponse = GetV1CollectionsByHandleResponses[keyof GetV1CollectionsByHandleResponses];
type GetV1CollectionsByHandleProductsData = {
    body?: never;
    path: {
        /**
         * Collection handle (slug)
         */
        handle: string;
    };
    query?: {
        limit?: number;
        offset?: number | null;
    };
    url: '/v1/collections/{handle}/products';
};
type GetV1CollectionsByHandleProductsErrors = {
    /**
     * Collection not found
     */
    404: unknown;
};
type GetV1CollectionsByHandleProductsResponses = {
    /**
     * Products in the collection
     */
    200: CollectionProductsResponse;
};
type GetV1CollectionsByHandleProductsResponse = GetV1CollectionsByHandleProductsResponses[keyof GetV1CollectionsByHandleProductsResponses];
type GetV1ThemeData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/v1/theme';
};
type GetV1ThemeResponses = {
    /**
     * Theme CSS variables as key-value pairs
     */
    200: ThemeResponse;
};
type GetV1ThemeResponse = GetV1ThemeResponses[keyof GetV1ThemeResponses];
type GetV1ShippingRatesData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Cart ID
         */
        cart_id: string;
        /**
         * Market ID (defaults to domestic market)
         */
        market_id?: string;
        /**
         * ISO country code
         */
        country?: string;
    };
    url: '/v1/shipping/rates';
};
type GetV1ShippingRatesErrors = {
    /**
     * Missing or invalid parameters
     */
    400: unknown;
};
type GetV1ShippingRatesResponses = {
    /**
     * Available shipping rates grouped by delivery profile
     */
    200: ShippingRatesResponse;
};
type GetV1ShippingRatesResponse = GetV1ShippingRatesResponses[keyof GetV1ShippingRatesResponses];
type GetV1PoliciesData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Locale filter
         */
        locale?: string;
    };
    url: '/v1/policies';
};
type GetV1PoliciesResponses = {
    /**
     * List of policies
     */
    200: PolicyListResponse;
};
type GetV1PoliciesResponse = GetV1PoliciesResponses[keyof GetV1PoliciesResponses];
type GetV1PoliciesByTypeData = {
    body?: never;
    path: {
        /**
         * Policy type slug (e.g. privacy-policy, terms-of-service)
         */
        type: string;
    };
    query?: {
        /**
         * Locale filter
         */
        locale?: string;
    };
    url: '/v1/policies/{type}';
};
type GetV1PoliciesByTypeErrors = {
    /**
     * Policy not found
     */
    404: unknown;
};
type GetV1PoliciesByTypeResponses = {
    /**
     * Policy detail
     */
    200: PolicyDetailResponse;
};
type GetV1PoliciesByTypeResponse = GetV1PoliciesByTypeResponses[keyof GetV1PoliciesByTypeResponses];

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
 * Get collection
 *
 * Get a single collection by handle
 */
declare const getV1CollectionsByHandle: <ThrowOnError extends boolean = false>(options: Options<GetV1CollectionsByHandleData, ThrowOnError>) => RequestResult<GetV1CollectionsByHandleResponses, GetV1CollectionsByHandleErrors, ThrowOnError, "fields">;
/**
 * Get collection products
 *
 * List products in a collection
 */
declare const getV1CollectionsByHandleProducts: <ThrowOnError extends boolean = false>(options: Options<GetV1CollectionsByHandleProductsData, ThrowOnError>) => RequestResult<GetV1CollectionsByHandleProductsResponses, GetV1CollectionsByHandleProductsErrors, ThrowOnError, "fields">;
/**
 * Get theme
 *
 * Get workspace theme CSS custom properties
 */
declare const getV1Theme: <ThrowOnError extends boolean = false>(options?: Options<GetV1ThemeData, ThrowOnError>) => RequestResult<GetV1ThemeResponses, unknown, ThrowOnError, "fields">;
/**
 * Get shipping rates
 *
 * Calculate shipping rates for a cart
 */
declare const getV1ShippingRates: <ThrowOnError extends boolean = false>(options: Options<GetV1ShippingRatesData, ThrowOnError>) => RequestResult<GetV1ShippingRatesResponses, GetV1ShippingRatesErrors, ThrowOnError, "fields">;
/**
 * List policies
 *
 * List all legal policies for the workspace
 */
declare const getV1Policies: <ThrowOnError extends boolean = false>(options?: Options<GetV1PoliciesData, ThrowOnError>) => RequestResult<GetV1PoliciesResponses, unknown, ThrowOnError, "fields">;
/**
 * Get policy
 *
 * Get a specific policy by type
 */
declare const getV1PoliciesByType: <ThrowOnError extends boolean = false>(options: Options<GetV1PoliciesByTypeData, ThrowOnError>) => RequestResult<GetV1PoliciesByTypeResponses, GetV1PoliciesByTypeErrors, ThrowOnError, "fields">;

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
        /**
         * Get a single collection by its handle/slug with metadata and product count.
         * @param params.path.handle - The collection handle
         */
        getCollection: (params: Parameters<typeof getV1CollectionsByHandle>[0]) => Promise<{
            data: {
                data: CollectionDetail;
            };
            request: Request;
            response: Response;
        } | (({
            data: {
                data: CollectionDetail;
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
         * List products belonging to a specific collection.
         * @param params.path.handle - The collection handle
         * @param params.query.limit - Number of products to return (1-100, default 50)
         * @param params.query.offset - Pagination offset (default 0)
         */
        getCollectionProducts: (params: Parameters<typeof getV1CollectionsByHandleProducts>[0]) => Promise<{
            data: CollectionProductsResponse;
            request: Request;
            response: Response;
        } | (({
            data: CollectionProductsResponse;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
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
        /**
         * Calculate shipping rates for a cart.
         * @param params.query.cart_id - Cart UUID
         * @param params.query.market_id - Optional market UUID
         * @param params.query.country - Optional ISO country code
         */
        getShippingRates: (params: Parameters<typeof getV1ShippingRates>[0]) => Promise<{
            data: ShippingRatesResponse;
            request: Request;
            response: Response;
        } | (({
            data: ShippingRatesResponse;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
    /** Order management: update address, resend emails, cancel. */
    orders: {
        /**
         * Update the shipping address of an existing order.
         * @param params.path.orderId - Order UUID
         * @param params.body.shipping_address - New address object
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
         * Resend the order confirmation email.
         * @param params.path.orderId - Order UUID
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
         * Resend the invoice email with PDF.
         * @param params.path.orderId - Order UUID
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
    /** Storefront operations: theme, legal policies. */
    storefront: {
        /**
         * Get workspace theme as CSS custom properties.
         */
        getTheme: (params?: Parameters<typeof getV1Theme>[0]) => Promise<{
            data: ThemeResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: ThemeResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * List all legal policies for the workspace.
         * @param params.query.locale - Locale filter (default "fr")
         */
        listPolicies: (params?: Parameters<typeof getV1Policies>[0]) => Promise<{
            data: PolicyListResponse;
            request: Request;
            response: Response;
        } | (({
            data: undefined;
            error: unknown;
        } | {
            data: PolicyListResponse;
            error: undefined;
        }) & {
            request?: Request;
            response?: Response;
        })>;
        /**
         * Get a specific legal policy by type.
         * @param params.path.type - Policy type slug (e.g. "privacy-policy")
         */
        getPolicy: (params: Parameters<typeof getV1PoliciesByType>[0]) => Promise<{
            data: PolicyDetailResponse;
            request: Request;
            response: Response;
        } | (({
            data: PolicyDetailResponse;
            error: undefined;
        } | {
            data: undefined;
            error: unknown;
        }) & {
            request?: Request;
            response?: Response;
        })>;
    };
}

export { type AddCartItemInput, type Cart, type CheckoutSession, type ClientOptions$1 as ClientOptions, type Collection, type CollectionDetail, type CollectionListResponse, type CollectionProductsResponse, type CreateCartInput, type CreateCheckoutInput, type DeleteV1CartsByIdItemsByLineIdData, type DeleteV1CartsByIdItemsByLineIdErrors, type DeleteV1CartsByIdItemsByLineIdResponses, type GetV1CartsByIdData, type GetV1CartsByIdErrors, type GetV1CartsByIdResponse, type GetV1CartsByIdResponses, type GetV1CollectionsByHandleData, type GetV1CollectionsByHandleErrors, type GetV1CollectionsByHandleProductsData, type GetV1CollectionsByHandleProductsErrors, type GetV1CollectionsByHandleProductsResponse, type GetV1CollectionsByHandleProductsResponses, type GetV1CollectionsByHandleResponse, type GetV1CollectionsByHandleResponses, type GetV1CollectionsData, type GetV1CollectionsResponse, type GetV1CollectionsResponses, type GetV1PoliciesByTypeData, type GetV1PoliciesByTypeErrors, type GetV1PoliciesByTypeResponse, type GetV1PoliciesByTypeResponses, type GetV1PoliciesData, type GetV1PoliciesResponse, type GetV1PoliciesResponses, type GetV1ProductsByIdData, type GetV1ProductsByIdErrors, type GetV1ProductsByIdResponse, type GetV1ProductsByIdResponses, type GetV1ProductsData, type GetV1ProductsResponse, type GetV1ProductsResponses, type GetV1ShippingRatesData, type GetV1ShippingRatesErrors, type GetV1ShippingRatesResponse, type GetV1ShippingRatesResponses, type GetV1ThemeData, type GetV1ThemeResponse, type GetV1ThemeResponses, type Options, type PatchV1OrdersByOrderIdShippingAddressData, type PatchV1OrdersByOrderIdShippingAddressErrors, type PatchV1OrdersByOrderIdShippingAddressResponse, type PatchV1OrdersByOrderIdShippingAddressResponses, type Policy, type PolicyDetailResponse, type PolicyListResponse, type PostV1CartsByIdItemsData, type PostV1CartsByIdItemsErrors, type PostV1CartsByIdItemsResponses, type PostV1CartsData, type PostV1CartsResponse, type PostV1CartsResponses, type PostV1CheckoutStripeData, type PostV1CheckoutStripeResponse, type PostV1CheckoutStripeResponses, type PostV1OrdersByOrderIdCancelData, type PostV1OrdersByOrderIdCancelErrors, type PostV1OrdersByOrderIdCancelResponses, type PostV1OrdersByOrderIdResendConfirmationData, type PostV1OrdersByOrderIdResendConfirmationErrors, type PostV1OrdersByOrderIdResendConfirmationResponse, type PostV1OrdersByOrderIdResendConfirmationResponses, type PostV1OrdersByOrderIdResendInvoiceData, type PostV1OrdersByOrderIdResendInvoiceErrors, type PostV1OrdersByOrderIdResendInvoiceResponse, type PostV1OrdersByOrderIdResendInvoiceResponses, type Product, type ProductListResponse, type ProductMetafield, type ProductVariant, type PutV1CartsByIdItemsByLineIdData, type PutV1CartsByIdItemsByLineIdErrors, type PutV1CartsByIdItemsByLineIdResponses, Reponse, type ReponseOptions, type ShippingRate, type ShippingRatesResponse, type ThemeResponse, type UpdateCartItemInput, client, deleteV1CartsByIdItemsByLineId, getV1CartsById, getV1Collections, getV1CollectionsByHandle, getV1CollectionsByHandleProducts, getV1Policies, getV1PoliciesByType, getV1Products, getV1ProductsById, getV1ShippingRates, getV1Theme, patchV1OrdersByOrderIdShippingAddress, postV1Carts, postV1CartsByIdItems, postV1CheckoutStripe, postV1OrdersByOrderIdCancel, postV1OrdersByOrderIdResendConfirmation, postV1OrdersByOrderIdResendInvoice, putV1CartsByIdItemsByLineId };
