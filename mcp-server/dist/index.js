#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const API_KEY = process.env.REPONSE_API_KEY;
const API_URL = process.env.REPONSE_API_URL || "https://api.reponse.ai";
if (!API_KEY) {
    console.error("REPONSE_API_KEY environment variable is required.");
    process.exit(1);
}
const server = new index_js_1.Server({
    name: "reponse-commerce-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
async function fetchFromApi(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`Reponse API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_products",
                description: "Retrieve a list of products from the Reponse Commerce backend. Use this to discover available products, their IDs, and prices.",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", description: "Number of products to return (default 50)" },
                        query: { type: "string", description: "Search query to filter products by title" },
                    },
                },
            },
            {
                name: "get_product",
                description: "Retrieve a single product by its ID to get detailed information.",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The UUID of the product" },
                    },
                    required: ["id"],
                },
            },
            {
                name: "create_cart",
                description: "Create a new shopping cart. Optionally add items to it immediately.",
                inputSchema: {
                    type: "object",
                    properties: {
                        currency: { type: "string", description: "Currency code (default EUR)" },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    product_id: { type: "string", description: "The UUID of the product" },
                                    quantity: { type: "number", description: "Quantity to add" },
                                },
                                required: ["product_id", "quantity"],
                            },
                        },
                    },
                },
            },
            {
                name: "list_collections",
                description: "Retrieve a list of collections/categories.",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", description: "Number of collections to return (default 50)" },
                    },
                },
            },
            {
                name: "get_cart",
                description: "Retrieve an existing shopping cart by its ID to check its contents and totals.",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The UUID of the cart" },
                    },
                    required: ["id"],
                },
            },
            {
                name: "add_to_cart",
                description: "Add items to an existing shopping cart.",
                inputSchema: {
                    type: "object",
                    properties: {
                        cart_id: { type: "string", description: "The UUID of the cart" },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    product_id: { type: "string", description: "The UUID of the product" },
                                    quantity: { type: "number", description: "Quantity to add" },
                                },
                                required: ["product_id", "quantity"],
                            },
                        },
                    },
                    required: ["cart_id", "items"],
                },
            },
            {
                name: "update_cart_item",
                description: "Update the quantity of an item in a cart. Set quantity to 0 to remove.",
                inputSchema: {
                    type: "object",
                    properties: {
                        cart_id: { type: "string", description: "The UUID of the cart" },
                        line_id: { type: "string", description: "The UUID of the cart line item" },
                        quantity: { type: "number", description: "New quantity" },
                    },
                    required: ["cart_id", "line_id", "quantity"],
                },
            },
            {
                name: "remove_cart_item",
                description: "Remove an item from a cart completely.",
                inputSchema: {
                    type: "object",
                    properties: {
                        cart_id: { type: "string", description: "The UUID of the cart" },
                        line_id: { type: "string", description: "The UUID of the cart line item" },
                    },
                    required: ["cart_id", "line_id"],
                },
            },
            {
                name: "create_checkout",
                description: "Generate a Stripe Checkout payment URL for an existing cart.",
                inputSchema: {
                    type: "object",
                    properties: {
                        cart_id: { type: "string", description: "The UUID of the cart" },
                        success_url: { type: "string", description: "URL to redirect to after successful payment" },
                        cancel_url: { type: "string", description: "URL to redirect to if payment is cancelled" },
                    },
                    required: ["cart_id"],
                },
            },
            {
                name: "update_shipping_address",
                description: "Update the shipping address of an existing order.\n\nBusiness Rules:\n- Fails if the order is already shipped, fulfilled, or cancelled.\n- Requires conversational identity verification (pass `conversation_id`).\n- Addresses must be complete (address1, city, zip, country required).",
                inputSchema: {
                    type: "object",
                    properties: {
                        order_id: { type: "string", description: "The UUID of the order" },
                        conversation_id: { type: "string", description: "The UUID of the conversation (required for B2C identity verification)" },
                        shipping_address: {
                            type: "object",
                            description: "The new shipping address object",
                            properties: {
                                address1: { type: "string" },
                                address2: { type: "string" },
                                city: { type: "string" },
                                zip: { type: "string" },
                                country: { type: "string" },
                            },
                            required: ["address1", "city", "zip", "country"]
                        }
                    },
                    required: ["order_id", "conversation_id", "shipping_address"],
                },
            },
            {
                name: "resend_order_confirmation",
                description: "Resend the order confirmation email to the customer.\n\nBusiness Rules:\n- Fails if the order is not paid.\n- Requires conversational identity verification (pass `conversation_id`).\n- STRICT RATE LIMIT: Maximum 3 times per hour per customer to prevent spam abuse.",
                inputSchema: {
                    type: "object",
                    properties: {
                        order_id: { type: "string", description: "The UUID of the order" },
                        conversation_id: { type: "string", description: "The UUID of the conversation (required for B2C identity verification)" },
                    },
                    required: ["order_id", "conversation_id"],
                },
            },
            {
                name: "resend_invoice",
                description: "Resend the invoice PDF email to the customer.\n\nBusiness Rules:\n- Fails if the order is not paid or if the merchant has not configured legal company info.\n- Requires conversational identity verification (pass `conversation_id`).\n- STRICT RATE LIMIT: Maximum 3 times per hour per customer to prevent spam abuse.",
                inputSchema: {
                    type: "object",
                    properties: {
                        order_id: { type: "string", description: "The UUID of the order" },
                        conversation_id: { type: "string", description: "The UUID of the conversation (required for B2C identity verification)" },
                    },
                    required: ["order_id", "conversation_id"],
                },
            },
            {
                name: "cancel_order",
                description: "Cancel an order and trigger a Stripe refund.\n\nBusiness Rules:\n- Fails if the order is already fulfilled or shipped.\n- Requires conversational identity verification (pass `conversation_id`).\n- Requires an exact business `reason` from the allowed enum for analytics and fraud detection.\n- STRICT RATE LIMIT: 1 cancellation per hour, max 3 times per 30 days per customer to prevent refund abuse.",
                inputSchema: {
                    type: "object",
                    properties: {
                        order_id: { type: "string", description: "The UUID of the order" },
                        conversation_id: { type: "string", description: "The UUID of the conversation (required for B2C identity verification)" },
                        reason: {
                            type: "string",
                            enum: [
                                "customer_changed_mind",
                                "wrong_item_ordered",
                                "delivery_too_slow_anticipated",
                                "found_better_price",
                                "payment_issue",
                                "other"
                            ],
                            description: "The exact reason for cancellation. Use 'other' only if none apply."
                        },
                        custom_reason: { type: "string", description: "Custom reason details, only if reason is 'other'" }
                    },
                    required: ["order_id", "conversation_id", "reason"],
                },
            },
            {
                name: "list_tickets",
                description: "List support tickets. Filter by status, category, or customer email.",
                inputSchema: {
                    type: "object",
                    properties: {
                        status: { type: "string", enum: ["open", "pending_customer", "resolved", "archived"], description: "Filter by ticket status" },
                        category: { type: "string", enum: ["shipping", "return_refund", "defective_product", "payment", "product_question", "other"], description: "Filter by category" },
                        customer_email: { type: "string", description: "Filter by customer email" },
                        limit: { type: "number", description: "Number of tickets to return (default 20)" },
                    },
                },
            },
            {
                name: "get_ticket",
                description: "Get a single support ticket by ID with full details including notes and conversation.",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The UUID of the ticket" },
                    },
                    required: ["id"],
                },
            },
            {
                name: "create_ticket",
                description: "Create a new support ticket for a customer.",
                inputSchema: {
                    type: "object",
                    properties: {
                        customer_email: { type: "string", description: "Customer email address" },
                        subject: { type: "string", description: "Ticket subject" },
                        message: { type: "string", description: "Initial message body" },
                        category: { type: "string", enum: ["shipping", "return_refund", "defective_product", "payment", "product_question", "other"], description: "Ticket category" },
                        order_id: { type: "string", description: "Related order UUID (optional)" },
                    },
                    required: ["customer_email", "subject", "message"],
                },
            },
            {
                name: "reply_to_ticket",
                description: "Send a reply to a support ticket on behalf of the customer.",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The UUID of the ticket" },
                        message: { type: "string", description: "Reply message body" },
                    },
                    required: ["id", "message"],
                },
            },
            {
                name: "list_discount_codes",
                description: "List discount codes for the workspace. Filter by active status.",
                inputSchema: {
                    type: "object",
                    properties: {
                        active: { type: "boolean", description: "Filter by active status (default true)" },
                        type: { type: "string", description: "Filter by type: percentage, fixed_amount, free_shipping, bxgy" },
                    },
                },
            },
            {
                name: "validate_discount_code",
                description: "Check if a discount code is valid and calculate potential savings.",
                inputSchema: {
                    type: "object",
                    properties: {
                        code: { type: "string", description: "The discount code to validate" },
                        cart_total: { type: "number", description: "Cart total amount for savings calculation" },
                        cart_quantity: { type: "number", description: "Number of items in cart" },
                        customer_tier: { type: "string", description: "Customer CRM tier (cold, warm, hot, vip)" },
                    },
                    required: ["code"],
                },
            },
            {
                name: "create_discount_code",
                description: "Create a new discount code.",
                inputSchema: {
                    type: "object",
                    properties: {
                        code: { type: "string", description: "The discount code text (will be uppercased)" },
                        type: { type: "string", description: "Type: percentage, fixed_amount, free_shipping, bxgy" },
                        value: { type: "number", description: "Discount value (percentage 0-100 or fixed amount)" },
                        starts_at: { type: "string", description: "Start date (ISO 8601)" },
                        end_at: { type: "string", description: "End date (ISO 8601)" },
                        usage_limit_total: { type: "number", description: "Maximum total uses" },
                        conditions: { type: "string", description: "Conditions for the AI to know when to apply" },
                    },
                    required: ["code", "type", "value"],
                },
            },
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "list_products") {
            const limit = typeof args?.limit === "number" ? args.limit : 50;
            const query = typeof args?.query === "string" ? args.query : "";
            const searchParams = new URLSearchParams();
            searchParams.set("limit", limit.toString());
            if (query)
                searchParams.set("query", query);
            const data = await fetchFromApi(`/v1/products?${searchParams.toString()}`);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "get_product") {
            const id = args?.id;
            if (typeof id !== "string")
                throw new Error("id must be a string");
            const data = await fetchFromApi(`/v1/products/${id}`);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "create_cart") {
            const data = await fetchFromApi(`/v1/carts`, {
                method: "POST",
                body: JSON.stringify({
                    currency: args?.currency || "EUR",
                    items: args?.items || [],
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "list_collections") {
            const limit = typeof args?.limit === "number" ? args.limit : 50;
            const data = await fetchFromApi(`/v1/collections?limit=${limit}`);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "get_cart") {
            const id = args?.id;
            if (typeof id !== "string")
                throw new Error("id must be a string");
            const data = await fetchFromApi(`/v1/carts/${id}`);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "add_to_cart") {
            const cart_id = args?.cart_id;
            if (typeof cart_id !== "string")
                throw new Error("cart_id must be a string");
            const data = await fetchFromApi(`/v1/carts/${cart_id}/items`, {
                method: "POST",
                body: JSON.stringify({ items: args?.items || [] }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "update_cart_item") {
            const cart_id = args?.cart_id;
            const line_id = args?.line_id;
            const quantity = args?.quantity;
            if (typeof cart_id !== "string" || typeof line_id !== "string" || typeof quantity !== "number") {
                throw new Error("Invalid arguments for update_cart_item");
            }
            const data = await fetchFromApi(`/v1/carts/${cart_id}/items/${line_id}`, {
                method: "PUT",
                body: JSON.stringify({ quantity }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "remove_cart_item") {
            const cart_id = args?.cart_id;
            const line_id = args?.line_id;
            if (typeof cart_id !== "string" || typeof line_id !== "string") {
                throw new Error("Invalid arguments for remove_cart_item");
            }
            const data = await fetchFromApi(`/v1/carts/${cart_id}/items/${line_id}`, {
                method: "DELETE",
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "create_checkout") {
            const cart_id = args?.cart_id;
            if (typeof cart_id !== "string") {
                throw new Error("Invalid arguments for create_checkout");
            }
            const data = await fetchFromApi(`/v1/checkout/stripe`, {
                method: "POST",
                body: JSON.stringify({
                    cart_id,
                    success_url: args?.success_url,
                    cancel_url: args?.cancel_url
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "update_shipping_address") {
            const order_id = args?.order_id;
            if (typeof order_id !== "string") {
                throw new Error("Invalid arguments for update_shipping_address");
            }
            const data = await fetchFromApi(`/v1/orders/${order_id}/shipping-address`, {
                method: "PATCH",
                body: JSON.stringify({
                    shipping_address: args?.shipping_address,
                    conversation_id: args?.conversation_id
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "resend_order_confirmation") {
            const order_id = args?.order_id;
            if (typeof order_id !== "string") {
                throw new Error("Invalid arguments for resend_order_confirmation");
            }
            const data = await fetchFromApi(`/v1/orders/${order_id}/resend-confirmation`, {
                method: "POST",
                body: JSON.stringify({
                    conversation_id: args?.conversation_id
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "resend_invoice") {
            const order_id = args?.order_id;
            if (typeof order_id !== "string") {
                throw new Error("Invalid arguments for resend_invoice");
            }
            const data = await fetchFromApi(`/v1/orders/${order_id}/resend-invoice`, {
                method: "POST",
                body: JSON.stringify({
                    conversation_id: args?.conversation_id
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "cancel_order") {
            const order_id = args?.order_id;
            if (typeof order_id !== "string") {
                throw new Error("Invalid arguments for cancel_order");
            }
            const data = await fetchFromApi(`/v1/orders/${order_id}/cancel`, {
                method: "POST",
                body: JSON.stringify({
                    conversation_id: args?.conversation_id,
                    reason: args?.reason,
                    custom_reason: args?.custom_reason
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "list_tickets") {
            const params = new URLSearchParams();
            if (typeof args?.status === "string")
                params.set("status", args.status);
            if (typeof args?.customer_email === "string")
                params.set("customer_email", args.customer_email);
            if (typeof args?.limit === "number")
                params.set("limit", args.limit.toString());
            const data = await fetchFromApi(`/v1/tickets?${params.toString()}`);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "get_ticket") {
            const id = args?.id;
            if (typeof id !== "string")
                throw new Error("id must be a string");
            const data = await fetchFromApi(`/v1/tickets/${id}`);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "create_ticket") {
            const data = await fetchFromApi(`/v1/tickets`, {
                method: "POST",
                body: JSON.stringify({
                    customer_email: args?.customer_email,
                    subject: args?.subject,
                    message: args?.message,
                    category: args?.category,
                    order_id: args?.order_id,
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "reply_to_ticket") {
            const id = args?.id;
            if (typeof id !== "string")
                throw new Error("id must be a string");
            const data = await fetchFromApi(`/v1/tickets/${id}/reply`, {
                method: "POST",
                body: JSON.stringify({ message: args?.message }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "list_discount_codes") {
            const params = new URLSearchParams();
            if (args?.active !== undefined)
                params.set("active", String(args.active));
            if (typeof args?.type === "string")
                params.set("type", args.type);
            const data = await fetchFromApi(`/v1/discounts?${params.toString()}`);
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "validate_discount_code") {
            const data = await fetchFromApi(`/v1/discounts/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: args?.code,
                    cart_total: args?.cart_total,
                    cart_quantity: args?.cart_quantity,
                    customer_tier: args?.customer_tier,
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        if (name === "create_discount_code") {
            const data = await fetchFromApi(`/v1/discounts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: args?.code,
                    type: args?.type,
                    value: args?.value,
                    starts_at: args?.starts_at,
                    end_at: args?.end_at,
                    usage_limit_total: args?.usage_limit_total,
                    conditions: args?.conditions,
                }),
            });
            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }
        throw new Error(`Tool not found: ${name}`);
    }
    catch (error) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error: ${error.message}` }],
        };
    }
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Reponse MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
