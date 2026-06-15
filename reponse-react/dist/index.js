"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ReponseProvider: () => ReponseProvider,
  useCart: () => useCart,
  useCollections: () => useCollections,
  useProduct: () => useProduct,
  useProducts: () => useProducts,
  useReponse: () => useReponse
});
module.exports = __toCommonJS(index_exports);

// src/provider.tsx
var import_react = require("react");
var import_sdk = require("@reponseai/sdk");
var import_jsx_runtime = require("react/jsx-runtime");
var ReponseContext = (0, import_react.createContext)(null);
function ReponseProvider({
  children,
  ...options
}) {
  const client = (0, import_react.useMemo)(
    () => new import_sdk.Reponse(options),
    [options.apiKey, options.baseUrl]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReponseContext.Provider, { value: client, children });
}
function useReponse() {
  const client = (0, import_react.useContext)(ReponseContext);
  if (!client) {
    throw new Error("useReponse must be used within a <ReponseProvider>");
  }
  return client;
}

// src/hooks.ts
var import_swr = __toESM(require("swr"));
function useProducts(params) {
  const client = useReponse();
  return (0, import_swr.default)(
    ["reponse", "products", params],
    () => client.catalog.listProducts({ query: params })
  );
}
function useProduct(id) {
  const client = useReponse();
  return (0, import_swr.default)(
    id ? ["reponse", "product", id] : null,
    () => client.catalog.getProduct({ path: { id } })
  );
}
function useCollections(params) {
  const client = useReponse();
  return (0, import_swr.default)(
    ["reponse", "collections", params],
    () => client.catalog.listCollections({ query: params })
  );
}
function useCart(cartId) {
  const client = useReponse();
  const { data, error, isLoading, mutate } = (0, import_swr.default)(
    cartId ? ["reponse", "cart", cartId] : null,
    () => client.cart.get({ path: { id: cartId } })
  );
  const addItem = async (productId, quantity, variantId) => {
    if (!cartId) return;
    await client.cart.addItem({
      path: { id: cartId },
      body: {
        items: [
          {
            product_id: productId,
            variant_id: variantId,
            quantity: quantity ?? 1
          }
        ]
      }
    });
    mutate();
  };
  const updateItem = async (lineId, quantity) => {
    if (!cartId) return;
    await client.cart.updateItem({
      path: { id: cartId, lineId },
      body: { quantity }
    });
    mutate();
  };
  const removeItem = async (lineId) => {
    if (!cartId) return;
    await client.cart.removeItem({
      path: { id: cartId, lineId }
    });
    mutate();
  };
  return { data, error, isLoading, mutate, addItem, updateItem, removeItem };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ReponseProvider,
  useCart,
  useCollections,
  useProduct,
  useProducts,
  useReponse
});
