export interface ApiErrorEnvelope {
  error:
    | string
    | {
        code?: string;
        message?: string;
        request_id?: string;
        details?: unknown;
      };
}

export interface ApiDataEnvelope<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface StorefrontProductVariant {
  id: string;
  title?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  inventory_quantity?: number | null;
  sku?: string | null;
  barcode?: string | null;
  option_values?: string[] | null;
  position?: number | null;
  weight?: number | null;
  weight_unit?: string | null;
}

export interface StorefrontOptionDefinition {
  name: string;
  position: number;
  values: string[];
}

export interface StorefrontProductSummary {
  id: string;
  title?: string;
  handle?: string;
  images?: string[];
}

export interface StorefrontProduct {
  id: string;
  title: string;
  slug?: string | null;
  handle?: string | null;
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  vendor?: string | null;
  category_name?: string | null;
  google_product_category_path?: string | null;
  product_type?: string | null;
  tags?: string[];
  price: number;
  compare_at_price?: number | null;
  currency?: string;
  in_stock?: boolean;
  images?: string[];
  status?: string;
  has_only_default_variant?: boolean;
  option_definitions?: string[] | StorefrontOptionDefinition[] | null;
  variants?: StorefrontProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface StorefrontCartItem {
  id: string;
  product_id: string;
  variant_id?: string | null;
  variant_title?: string | null;
  quantity: number;
  price: number;
  product?: StorefrontProductSummary;
}

export interface StorefrontDiscount {
  code: string;
  savings: number;
}

export interface StorefrontCart {
  id?: string;
  items: StorefrontCartItem[];
  subtotal: number;
  total?: number;
  currency: string;
  applied_discounts?: StorefrontDiscount[];
  automatic_discounts?: StorefrontDiscount[];
  discount_total?: number;
  adjusted_total?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PromoResult {
  success: boolean;
  error?: string;
  code?: string;
  discount?: number;
}

export interface Review {
  id: string;
  title: string | null;
  content: string | null;
  rating: number;
  author_first_name: string | null;
  author_last_initial: string | null;
  verified_purchase: boolean;
  media_urls: string[];
  published_at: string;
  response_content: string | null;
  response_sent_at: string | null;
  product_id?: string;
  product_title_snapshot?: string;
}

export interface ReviewAggregates {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  aggregates: ReviewAggregates;
  next_cursor: string | null;
  has_more: boolean;
}

export interface StoreReviewsResponse {
  reviews: Review[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface OrderLineItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  title: string;
  variant_title: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
  sku: string | null;
}

export interface OrderAddress {
  first_name: string | null;
  last_name: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
}

export interface OrderFulfillment {
  id: string;
  status: string;
  tracking_number: string | null;
  tracking_url: string | null;
  tracking_company: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string | null;
  status: string;
  financial_status: string;
  fulfillment_status: string | null;
  currency: string;
  subtotal_price: number;
  total_tax: number;
  total_shipping: number;
  total_discounts: number;
  total_price: number;
  line_items: OrderLineItem[];
  shipping_address: OrderAddress | null;
  billing_address: OrderAddress | null;
  fulfillments: OrderFulfillment[];
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  cancel_reason: string | null;
  note: string | null;
  contact_id: string | null;
  email: string | null;
}

export interface OrderLookupResult {
  id: string;
  order_number: string | null;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: number;
  currency: string;
  email: string | null;
  created_at: string;
  shipping_address: OrderAddress | null;
  tracking_number: string | null;
  tracking_url: string | null;
}

export interface AuthenticatedContact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  lifecycle_stage: string | null;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface LoyaltyEarningRule {
  id: string;
  event: string;
  points: number;
  label: string;
  description: string | null;
  multiplier: number | null;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  min_points: number;
  multiplier: number;
  perks: string[];
  color: string | null;
}

export interface LoyaltyProgram {
  points_name: string;
  points_currency_ratio: number;
  referral_enabled: boolean;
  is_active: boolean;
  tiers: LoyaltyTier[];
  earning_rules: LoyaltyEarningRule[];
}

export interface LoyaltyBalance {
  points_balance: number;
  points_earned_total: number;
  tier: LoyaltyTier | null;
  referral_code: string | null;
  currency_value: number;
}

export interface ReferralInfo {
  referral_code: string;
  referral_url: string;
  stats: {
    pending: number;
    converted: number;
    total_earned: number;
  };
}

export interface RedeemResult {
  success: boolean;
  error?: string;
  points_redeemed?: number;
  currency_value?: number;
}

export interface TicketNote {
  id: string;
  body: string;
  author_type: "customer" | "agent" | "system";
  author_name: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "pending" | "resolved" | "closed";
  category: string | null;
  priority: string | null;
  customer_email: string;
  order_id: string | null;
  notes: TicketNote[];
  created_at: string;
  updated_at: string;
}

export interface CreateTicketData {
  customer_email: string;
  subject: string;
  message: string;
  category?: string;
  order_id?: string;
}

export interface CreateTicketResult {
  success: boolean;
  id?: string;
  status?: string;
  error?: string;
}

export interface ReplyResult {
  success: boolean;
  error?: string;
}

export interface ShippingRate {
  id: string;
  profile_id?: string;
  profile_name?: string;
  name: string;
  price: number;
  currency: string;
  delivery_estimate?: { min_days: number | null; max_days: number | null };
  is_free: boolean;
}

export interface CheckoutSummaryItem {
  id: string;
  title: string;
  variant_title: string | null;
  quantity: number;
  unit_price: number;
  line_price: number;
  image_url: string;
}

export interface DiscountValidationResult {
  amount: number;
  label: string;
  type: string;
}

export interface AppliedGiftCard {
  code: string;
  amount: number;
}

export interface OtpVerifyResponse {
  success?: boolean;
  contactId?: string;
  sessionToken?: string;
  error?: string;
}
