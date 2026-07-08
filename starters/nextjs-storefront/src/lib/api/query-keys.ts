export const queryKeys = {
  cart: {
    all: ["cart"] as const,
    detail: (cartId: string) => ["cart", "detail", cartId] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    product: (productId: string, sort: string) => ["reviews", "product", productId, sort] as const,
    store: () => ["reviews", "store"] as const,
  },
  orders: {
    lookup: (email: string, orderNumber: string) => ["orders", "lookup", email, orderNumber] as const,
  },
  tickets: {
    all: ["tickets"] as const,
    detail: (ticketId: string) => ["tickets", "detail", ticketId] as const,
  },
  loyalty: {
    program: () => ["loyalty", "program"] as const,
    balance: (contactId: string) => ["loyalty", "balance", contactId] as const,
  },
  checkout: {
    all: ["checkout"] as const,
    cart: (cartId: string) => ["checkout", "cart", cartId] as const,
    shippingRates: (cartId: string, country: string) =>
      ["checkout", "shipping-rates", cartId, country] as const,
  },
} as const;
