// src/gen/core/bodySerializer.gen.ts
var jsonBodySerializer = {
  bodySerializer: (body) => JSON.stringify(body, (_key, value) => typeof value === "bigint" ? value.toString() : value)
};

// src/gen/core/params.gen.ts
var extraPrefixesMap = {
  $body_: "body",
  $headers_: "headers",
  $path_: "path",
  $query_: "query"
};
var extraPrefixes = Object.entries(extraPrefixesMap);

// src/gen/core/serverSentEvents.gen.ts
function createSseClient({
  onRequest,
  onSseError,
  onSseEvent,
  responseTransformer,
  responseValidator,
  sseDefaultRetryDelay,
  sseMaxRetryAttempts,
  sseMaxRetryDelay,
  sseSleepFn,
  url,
  ...options
}) {
  let lastEventId;
  const sleep = sseSleepFn ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const createStream = async function* () {
    let retryDelay = sseDefaultRetryDelay ?? 3e3;
    let attempt = 0;
    const signal = options.signal ?? new AbortController().signal;
    while (true) {
      if (signal.aborted) break;
      attempt++;
      const headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
      if (lastEventId !== void 0) {
        headers.set("Last-Event-ID", lastEventId);
      }
      try {
        const requestInit = {
          redirect: "follow",
          ...options,
          body: options.serializedBody,
          headers,
          signal
        };
        let request = new Request(url, requestInit);
        if (onRequest) {
          request = await onRequest(url, requestInit);
        }
        const _fetch = options.fetch ?? globalThis.fetch;
        const response = await _fetch(request);
        if (!response.ok) throw new Error(`SSE failed: ${response.status} ${response.statusText}`);
        if (!response.body) throw new Error("No body in SSE response");
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = "";
        const abortHandler = () => {
          try {
            reader.cancel();
          } catch {
          }
        };
        signal.addEventListener("abort", abortHandler);
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += value;
            buffer = buffer.replace(/\r\n?/g, "\n");
            const chunks = buffer.split("\n\n");
            buffer = chunks.pop() ?? "";
            for (const chunk of chunks) {
              const lines = chunk.split("\n");
              const dataLines = [];
              let eventName;
              for (const line of lines) {
                if (line.startsWith("data:")) {
                  dataLines.push(line.replace(/^data:\s*/, ""));
                } else if (line.startsWith("event:")) {
                  eventName = line.replace(/^event:\s*/, "");
                } else if (line.startsWith("id:")) {
                  lastEventId = line.replace(/^id:\s*/, "");
                } else if (line.startsWith("retry:")) {
                  const parsed = Number.parseInt(line.replace(/^retry:\s*/, ""), 10);
                  if (!Number.isNaN(parsed)) {
                    retryDelay = parsed;
                  }
                }
              }
              let data;
              let parsedJson = false;
              if (dataLines.length) {
                const rawData = dataLines.join("\n");
                try {
                  data = JSON.parse(rawData);
                  parsedJson = true;
                } catch {
                  data = rawData;
                }
              }
              if (parsedJson) {
                if (responseValidator) {
                  await responseValidator(data);
                }
                if (responseTransformer) {
                  data = await responseTransformer(data);
                }
              }
              onSseEvent?.({
                data,
                event: eventName,
                id: lastEventId,
                retry: retryDelay
              });
              if (dataLines.length) {
                yield data;
              }
            }
          }
        } finally {
          signal.removeEventListener("abort", abortHandler);
          reader.releaseLock();
        }
        break;
      } catch (error) {
        onSseError?.(error);
        if (sseMaxRetryAttempts !== void 0 && attempt >= sseMaxRetryAttempts) {
          break;
        }
        const backoff = Math.min(retryDelay * 2 ** (attempt - 1), sseMaxRetryDelay ?? 3e4);
        await sleep(backoff);
      }
    }
  };
  const stream = createStream();
  return { stream };
}

// src/gen/core/pathSerializer.gen.ts
var separatorArrayExplode = (style) => {
  switch (style) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
};
var separatorArrayNoExplode = (style) => {
  switch (style) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
};
var separatorObjectExplode = (style) => {
  switch (style) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
};
var serializeArrayParam = ({
  allowReserved,
  explode,
  name,
  style,
  value
}) => {
  if (!explode) {
    const joinedValues2 = (allowReserved ? value : value.map((v) => encodeURIComponent(v))).join(separatorArrayNoExplode(style));
    switch (style) {
      case "label":
        return `.${joinedValues2}`;
      case "matrix":
        return `;${name}=${joinedValues2}`;
      case "simple":
        return joinedValues2;
      default:
        return `${name}=${joinedValues2}`;
    }
  }
  const separator = separatorArrayExplode(style);
  const joinedValues = value.map((v) => {
    if (style === "label" || style === "simple") {
      return allowReserved ? v : encodeURIComponent(v);
    }
    return serializePrimitiveParam({
      allowReserved,
      name,
      value: v
    });
  }).join(separator);
  return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
};
var serializePrimitiveParam = ({
  allowReserved,
  name,
  value
}) => {
  if (value === void 0 || value === null) {
    return "";
  }
  if (typeof value === "object") {
    throw new Error(
      "Deeply-nested arrays/objects aren\u2019t supported. Provide your own `querySerializer()` to handle these."
    );
  }
  return `${name}=${allowReserved ? value : encodeURIComponent(value)}`;
};
var serializeObjectParam = ({
  allowReserved,
  explode,
  name,
  style,
  value,
  valueOnly
}) => {
  if (value instanceof Date) {
    return valueOnly ? value.toISOString() : `${name}=${value.toISOString()}`;
  }
  if (style !== "deepObject" && !explode) {
    let values = [];
    Object.entries(value).forEach(([key, v]) => {
      values = [...values, key, allowReserved ? v : encodeURIComponent(v)];
    });
    const joinedValues2 = values.join(",");
    switch (style) {
      case "form":
        return `${name}=${joinedValues2}`;
      case "label":
        return `.${joinedValues2}`;
      case "matrix":
        return `;${name}=${joinedValues2}`;
      default:
        return joinedValues2;
    }
  }
  const separator = separatorObjectExplode(style);
  const joinedValues = Object.entries(value).map(
    ([key, v]) => serializePrimitiveParam({
      allowReserved,
      name: style === "deepObject" ? `${name}[${key}]` : key,
      value: v
    })
  ).join(separator);
  return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
};

// src/gen/core/utils.gen.ts
var PATH_PARAM_RE = /\{[^{}]+\}/g;
var defaultPathSerializer = ({ path, url: _url }) => {
  let url = _url;
  const matches = _url.match(PATH_PARAM_RE);
  if (matches) {
    for (const match of matches) {
      let explode = false;
      let name = match.substring(1, match.length - 1);
      let style = "simple";
      if (name.endsWith("*")) {
        explode = true;
        name = name.substring(0, name.length - 1);
      }
      if (name.startsWith(".")) {
        name = name.substring(1);
        style = "label";
      } else if (name.startsWith(";")) {
        name = name.substring(1);
        style = "matrix";
      }
      const value = path[name];
      if (value === void 0 || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        url = url.replace(match, serializeArrayParam({ explode, name, style, value }));
        continue;
      }
      if (typeof value === "object") {
        url = url.replace(
          match,
          serializeObjectParam({
            explode,
            name,
            style,
            value,
            valueOnly: true
          })
        );
        continue;
      }
      if (style === "matrix") {
        url = url.replace(
          match,
          `;${serializePrimitiveParam({
            name,
            value
          })}`
        );
        continue;
      }
      const replaceValue = encodeURIComponent(
        style === "label" ? `.${value}` : value
      );
      url = url.replace(match, replaceValue);
    }
  }
  return url;
};
var getUrl = ({
  baseUrl,
  path,
  query,
  querySerializer,
  url: _url
}) => {
  const pathUrl = _url.startsWith("/") ? _url : `/${_url}`;
  let url = (baseUrl ?? "") + pathUrl;
  if (path) {
    url = defaultPathSerializer({ path, url });
  }
  let search = query ? querySerializer(query) : "";
  if (search.startsWith("?")) {
    search = search.substring(1);
  }
  if (search) {
    url += `?${search}`;
  }
  return url;
};
function getValidRequestBody(options) {
  const hasBody = options.body !== void 0;
  const isSerializedBody = hasBody && options.bodySerializer;
  if (isSerializedBody) {
    if ("serializedBody" in options) {
      const hasSerializedBody = options.serializedBody !== void 0 && options.serializedBody !== "";
      return hasSerializedBody ? options.serializedBody : null;
    }
    return options.body !== "" ? options.body : null;
  }
  if (hasBody) {
    return options.body;
  }
  return void 0;
}

// src/gen/core/auth.gen.ts
var getAuthToken = async (auth, callback) => {
  const token = typeof callback === "function" ? await callback(auth) : callback;
  if (!token) {
    return;
  }
  if (auth.scheme === "bearer") {
    return `Bearer ${token}`;
  }
  if (auth.scheme === "basic") {
    return `Basic ${btoa(token)}`;
  }
  return token;
};

// src/gen/client/utils.gen.ts
var createQuerySerializer = ({
  parameters = {},
  ...args
} = {}) => {
  const querySerializer = (queryParams) => {
    const search = [];
    if (queryParams && typeof queryParams === "object") {
      for (const name in queryParams) {
        const value = queryParams[name];
        if (value === void 0 || value === null) {
          continue;
        }
        const options = parameters[name] || args;
        if (Array.isArray(value)) {
          const serializedArray = serializeArrayParam({
            allowReserved: options.allowReserved,
            explode: true,
            name,
            style: "form",
            value,
            ...options.array
          });
          if (serializedArray) search.push(serializedArray);
        } else if (typeof value === "object") {
          const serializedObject = serializeObjectParam({
            allowReserved: options.allowReserved,
            explode: true,
            name,
            style: "deepObject",
            value,
            ...options.object
          });
          if (serializedObject) search.push(serializedObject);
        } else {
          const serializedPrimitive = serializePrimitiveParam({
            allowReserved: options.allowReserved,
            name,
            value
          });
          if (serializedPrimitive) search.push(serializedPrimitive);
        }
      }
    }
    return search.join("&");
  };
  return querySerializer;
};
var getParseAs = (contentType) => {
  if (!contentType) {
    return "stream";
  }
  const cleanContent = contentType.split(";")[0]?.trim();
  if (!cleanContent) {
    return;
  }
  if (cleanContent.startsWith("application/json") || cleanContent.endsWith("+json")) {
    return "json";
  }
  if (cleanContent === "multipart/form-data") {
    return "formData";
  }
  if (["application/", "audio/", "image/", "video/"].some((type) => cleanContent.startsWith(type))) {
    return "blob";
  }
  if (cleanContent.startsWith("text/")) {
    return "text";
  }
  return;
};
var checkForExistence = (options, name) => {
  if (!name) {
    return false;
  }
  if (options.headers.has(name) || options.query?.[name] || options.headers.get("Cookie")?.includes(`${name}=`)) {
    return true;
  }
  return false;
};
async function setAuthParams(options) {
  for (const auth of options.security ?? []) {
    if (checkForExistence(options, auth.name)) {
      continue;
    }
    const token = await getAuthToken(auth, options.auth);
    if (!token) {
      continue;
    }
    const name = auth.name ?? "Authorization";
    switch (auth.in) {
      case "query":
        if (!options.query) {
          options.query = {};
        }
        options.query[name] = token;
        break;
      case "cookie":
        options.headers.append("Cookie", `${name}=${token}`);
        break;
      case "header":
      default:
        options.headers.set(name, token);
        break;
    }
  }
}
var buildUrl = (options) => getUrl({
  baseUrl: options.baseUrl,
  path: options.path,
  query: options.query,
  querySerializer: typeof options.querySerializer === "function" ? options.querySerializer : createQuerySerializer(options.querySerializer),
  url: options.url
});
var mergeConfigs = (a, b) => {
  const config = { ...a, ...b };
  if (config.baseUrl?.endsWith("/")) {
    config.baseUrl = config.baseUrl.substring(0, config.baseUrl.length - 1);
  }
  config.headers = mergeHeaders(a.headers, b.headers);
  return config;
};
var headersEntries = (headers) => {
  const entries = [];
  headers.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
};
var mergeHeaders = (...headers) => {
  const mergedHeaders = new Headers();
  for (const header of headers) {
    if (!header) {
      continue;
    }
    const iterator = header instanceof Headers ? headersEntries(header) : Object.entries(header);
    for (const [key, value] of iterator) {
      if (value === null) {
        mergedHeaders.delete(key);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          mergedHeaders.append(key, v);
        }
      } else if (value !== void 0) {
        mergedHeaders.set(
          key,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      }
    }
  }
  return mergedHeaders;
};
var Interceptors = class {
  fns = [];
  clear() {
    this.fns = [];
  }
  eject(id) {
    const index = this.getInterceptorIndex(id);
    if (this.fns[index]) {
      this.fns[index] = null;
    }
  }
  exists(id) {
    const index = this.getInterceptorIndex(id);
    return Boolean(this.fns[index]);
  }
  getInterceptorIndex(id) {
    if (typeof id === "number") {
      return this.fns[id] ? id : -1;
    }
    return this.fns.indexOf(id);
  }
  update(id, fn) {
    const index = this.getInterceptorIndex(id);
    if (this.fns[index]) {
      this.fns[index] = fn;
      return id;
    }
    return false;
  }
  use(fn) {
    this.fns.push(fn);
    return this.fns.length - 1;
  }
};
var createInterceptors = () => ({
  error: new Interceptors(),
  request: new Interceptors(),
  response: new Interceptors()
});
var defaultQuerySerializer = createQuerySerializer({
  allowReserved: false,
  array: {
    explode: true,
    style: "form"
  },
  object: {
    explode: true,
    style: "deepObject"
  }
});
var defaultHeaders = {
  "Content-Type": "application/json"
};
var createConfig = (override = {}) => ({
  ...jsonBodySerializer,
  headers: defaultHeaders,
  parseAs: "auto",
  querySerializer: defaultQuerySerializer,
  ...override
});

// src/gen/client/client.gen.ts
var createClient = (config = {}) => {
  let _config = mergeConfigs(createConfig(), config);
  const getConfig = () => ({ ..._config });
  const setConfig = (config2) => {
    _config = mergeConfigs(_config, config2);
    return getConfig();
  };
  const interceptors = createInterceptors();
  const beforeRequest = async (options) => {
    const opts = {
      ..._config,
      ...options,
      fetch: options.fetch ?? _config.fetch ?? globalThis.fetch,
      headers: mergeHeaders(_config.headers, options.headers),
      serializedBody: void 0
    };
    if (opts.security) {
      await setAuthParams(opts);
    }
    if (opts.requestValidator) {
      await opts.requestValidator(opts);
    }
    if (opts.body !== void 0 && opts.bodySerializer) {
      opts.serializedBody = opts.bodySerializer(opts.body);
    }
    if (opts.body === void 0 || opts.serializedBody === "") {
      opts.headers.delete("Content-Type");
    }
    const resolvedOpts = opts;
    const url = buildUrl(resolvedOpts);
    return { opts: resolvedOpts, url };
  };
  const request = async (options) => {
    const throwOnError = options.throwOnError ?? _config.throwOnError;
    const responseStyle = options.responseStyle ?? _config.responseStyle;
    let request2;
    let response;
    try {
      const { opts, url } = await beforeRequest(options);
      const requestInit = {
        redirect: "follow",
        ...opts,
        body: getValidRequestBody(opts)
      };
      request2 = new Request(url, requestInit);
      for (const fn of interceptors.request.fns) {
        if (fn) {
          request2 = await fn(request2, opts);
        }
      }
      const _fetch = opts.fetch;
      response = await _fetch(request2);
      for (const fn of interceptors.response.fns) {
        if (fn) {
          response = await fn(response, request2, opts);
        }
      }
      const result = {
        request: request2,
        response
      };
      if (response.ok) {
        const parseAs = (opts.parseAs === "auto" ? getParseAs(response.headers.get("Content-Type")) : opts.parseAs) ?? "json";
        if (response.status === 204 || response.headers.get("Content-Length") === "0") {
          let emptyData;
          switch (parseAs) {
            case "arrayBuffer":
            case "blob":
            case "text":
              emptyData = await response[parseAs]();
              break;
            case "formData":
              emptyData = new FormData();
              break;
            case "stream":
              emptyData = response.body;
              break;
            case "json":
            default:
              emptyData = {};
              break;
          }
          return opts.responseStyle === "data" ? emptyData : {
            data: emptyData,
            ...result
          };
        }
        let data;
        switch (parseAs) {
          case "arrayBuffer":
          case "blob":
          case "formData":
          case "text":
            data = await response[parseAs]();
            break;
          case "json": {
            const text = await response.text();
            data = text ? JSON.parse(text) : {};
            break;
          }
          case "stream":
            return opts.responseStyle === "data" ? response.body : {
              data: response.body,
              ...result
            };
        }
        if (parseAs === "json") {
          if (opts.responseValidator) {
            await opts.responseValidator(data);
          }
          if (opts.responseTransformer) {
            data = await opts.responseTransformer(data);
          }
        }
        return opts.responseStyle === "data" ? data : {
          data,
          ...result
        };
      }
      const textError = await response.text();
      let jsonError;
      try {
        jsonError = JSON.parse(textError);
      } catch {
      }
      throw jsonError ?? textError;
    } catch (error) {
      let finalError = error;
      for (const fn of interceptors.error.fns) {
        if (fn) {
          finalError = await fn(finalError, response, request2, options);
        }
      }
      finalError = finalError || {};
      if (throwOnError) {
        throw finalError;
      }
      return responseStyle === "data" ? void 0 : {
        error: finalError,
        request: request2,
        response
      };
    }
  };
  const makeMethodFn = (method) => (options) => request({ ...options, method });
  const makeSseFn = (method) => async (options) => {
    const { opts, url } = await beforeRequest(options);
    return createSseClient({
      ...opts,
      body: opts.body,
      method,
      onRequest: async (url2, init) => {
        let request2 = new Request(url2, init);
        for (const fn of interceptors.request.fns) {
          if (fn) {
            request2 = await fn(request2, opts);
          }
        }
        return request2;
      },
      serializedBody: getValidRequestBody(opts),
      url
    });
  };
  const _buildUrl = (options) => buildUrl({ ..._config, ...options });
  return {
    buildUrl: _buildUrl,
    connect: makeMethodFn("CONNECT"),
    delete: makeMethodFn("DELETE"),
    get: makeMethodFn("GET"),
    getConfig,
    head: makeMethodFn("HEAD"),
    interceptors,
    options: makeMethodFn("OPTIONS"),
    patch: makeMethodFn("PATCH"),
    post: makeMethodFn("POST"),
    put: makeMethodFn("PUT"),
    request,
    setConfig,
    sse: {
      connect: makeSseFn("CONNECT"),
      delete: makeSseFn("DELETE"),
      get: makeSseFn("GET"),
      head: makeSseFn("HEAD"),
      options: makeSseFn("OPTIONS"),
      patch: makeSseFn("PATCH"),
      post: makeSseFn("POST"),
      put: makeSseFn("PUT"),
      trace: makeSseFn("TRACE")
    },
    trace: makeMethodFn("TRACE")
  };
};

// src/gen/client.gen.ts
var client = createClient(createConfig({ baseUrl: "https://api.reponse.ai" }));

// src/gen/sdk.gen.ts
var getV1Products = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/products",
  ...options
});
var getV1ProductsById = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/products/{id}",
  ...options
});
var postV1Carts = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/carts",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var getV1CartsById = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/carts/{id}",
  ...options
});
var postV1CartsByIdItems = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/carts/{id}/items",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var deleteV1CartsByIdItemsByLineId = (options) => (options.client ?? client).delete({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/carts/{id}/items/{lineId}",
  ...options
});
var putV1CartsByIdItemsByLineId = (options) => (options.client ?? client).put({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/carts/{id}/items/{lineId}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var patchV1OrdersByOrderIdShippingAddress = (options) => (options.client ?? client).patch({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/orders/{orderId}/shipping-address",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var postV1OrdersByOrderIdResendConfirmation = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/orders/{orderId}/resend-confirmation",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var postV1OrdersByOrderIdResendInvoice = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/orders/{orderId}/resend-invoice",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var postV1OrdersByOrderIdCancel = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/orders/{orderId}/cancel",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getV1Collections = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/collections",
  ...options
});
var postV1CheckoutStripe = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/checkout/stripe",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var getV1Orders = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/orders",
  ...options
});
var postV1OrdersByOrderIdFulfill = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/orders/{orderId}/fulfill",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var postV1OrdersByOrderIdRefund = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/orders/{orderId}/refund",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getV1Inventory = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/inventory",
  ...options
});
var postV1Inventory = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/inventory",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var getV1Loyalty = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/loyalty",
  ...options
});
var postV1LoyaltyRedeem = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/loyalty/redeem",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var getV1LoyaltyReferral = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/loyalty/referral",
  ...options
});
var getV1GiftCards = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/gift-cards",
  ...options
});
var postV1GiftCards = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/gift-cards",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var postV1GiftCardsRedeem = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/gift-cards/redeem",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var patchV1SubscriptionsBySubscriptionId = (options) => (options.client ?? client).patch({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/subscriptions/{subscriptionId}",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getV1Tickets = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/tickets",
  ...options
});
var postV1Tickets = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/tickets",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var getV1TicketsById = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/tickets/{id}",
  ...options
});
var postV1TicketsByIdReply = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/tickets/{id}/reply",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getV1Discounts = (options) => (options?.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/discounts",
  ...options
});
var postV1Discounts = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/discounts",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var postV1DiscountsValidate = (options) => (options?.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/discounts/validate",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers
  }
});
var postV1ApprovalsByApprovalIdExecute = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/approvals/{approvalId}/execute",
  ...options
});
var postV1ApprovalsByApprovalIdReject = (options) => (options.client ?? client).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/approvals/{approvalId}/reject",
  ...options,
  headers: {
    "Content-Type": "application/json",
    ...options.headers
  }
});
var getV1UtilsGeocode = (options) => (options.client ?? client).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/v1/utils/geocode",
  ...options
});

// src/index.ts
var Reponse = class {
  constructor(options) {
    client.setConfig({
      baseUrl: options.baseUrl || "https://api.reponse.ai",
      headers: {
        Authorization: `Bearer ${options.apiKey}`
      }
    });
  }
  // ─── Catalog ──────────────────────────────────────────────
  /** Product catalog operations: list, search, and retrieve products and collections. */
  catalog = {
    /**
     * List products from the catalog.
     * @param params.query.limit - Number of products to return (1-100, default 50)
     * @param params.query.cursor - Cursor for pagination
     * @param params.query.query - Search query to filter by title
     * @param params.query.slug - Filter by product slug/handle
     * @returns Paginated list of products with variants and pricing
     */
    listProducts: async (params) => getV1Products(params),
    /**
     * Get a single product by its ID with full details (variants, images, pricing).
     * @param params.path.id - The UUID of the product
     */
    getProduct: async (params) => getV1ProductsById(params),
    /**
     * List all product collections/categories.
     * @param params.query.limit - Number of collections to return (default 50)
     */
    listCollections: async (params) => getV1Collections(params)
  };
  // ─── Cart ─────────────────────────────────────────────────
  /** Shopping cart operations: create, read, add/update/remove items. */
  cart = {
    /**
     * Create a new shopping cart.
     * @param params.body.currency - Currency code (default EUR)
     * @param params.body.items - Optional initial items to add
     */
    create: async (params) => postV1Carts(params),
    /**
     * Get an existing cart by ID with items and totals.
     * @param params.path.id - The UUID of the cart
     */
    get: async (params) => getV1CartsById(params),
    /**
     * Add items to an existing cart.
     * @param params.path.id - Cart UUID
     * @param params.body.items - Array of { product_id, variant_id?, quantity }
     */
    addItem: async (params) => postV1CartsByIdItems(params),
    /**
     * Update the quantity of a cart line item. Set quantity to 0 to remove.
     * @param params.path.id - Cart UUID
     * @param params.path.lineId - Line item UUID
     * @param params.body.quantity - New quantity
     */
    updateItem: async (params) => putV1CartsByIdItemsByLineId(params),
    /**
     * Remove an item from a cart completely.
     * @param params.path.id - Cart UUID
     * @param params.path.lineId - Line item UUID to remove
     */
    removeItem: async (params) => deleteV1CartsByIdItemsByLineId(params),
    /**
     * Create a Stripe Checkout session for a cart. Returns a redirect URL.
     * @param params.body.cart_id - Cart UUID
     * @param params.body.success_url - Redirect URL after successful payment
     * @param params.body.cancel_url - Redirect URL if payment is cancelled
     */
    createCheckout: async (params) => postV1CheckoutStripe(params)
  };
  // ─── Orders ───────────────────────────────────────────────
  /** Order management: list, fulfill, refund, cancel, and notifications. */
  orders = {
    /**
     * List orders with optional status filter.
     * @param params.query.status - Filter by status (paid, fulfilled, shipped, cancelled, refunded)
     * @param params.query.limit - Number of orders to return (default 50)
     */
    list: async (params) => getV1Orders(params),
    /**
     * Mark an order as fulfilled and optionally attach tracking info.
     * @param params.path.orderId - Order UUID
     * @param params.body.tracking_number - Shipment tracking number
     * @param params.body.tracking_company - Carrier name
     * @param params.body.tracking_url - Tracking URL
     * @param params.body.send_email - Send notification email (default true)
     */
    fulfill: async (params) => postV1OrdersByOrderIdFulfill(params),
    /**
     * Refund an order (full or partial).
     * @param params.path.orderId - Order UUID
     * @param params.body.amount - Partial refund amount (omit for full refund)
     * @param params.body.reason - Reason for the refund
     */
    refund: async (params) => postV1OrdersByOrderIdRefund(params),
    /**
     * Update the shipping address of an existing order.
     * @param params.path.orderId - Order UUID
     * @param params.body.shipping_address - New address object
     * @param params.body.conversation_id - Conversation UUID for identity verification
     */
    updateShippingAddress: async (params) => patchV1OrdersByOrderIdShippingAddress(params),
    /**
     * Resend the order confirmation email. Rate limited: max 3 per hour.
     * @param params.path.orderId - Order UUID
     * @param params.body.conversation_id - Conversation UUID for identity verification
     */
    resendConfirmation: async (params) => postV1OrdersByOrderIdResendConfirmation(params),
    /**
     * Resend the invoice email with PDF. Rate limited: max 3 per hour.
     * @param params.path.orderId - Order UUID
     * @param params.body.conversation_id - Conversation UUID for identity verification
     */
    resendInvoice: async (params) => postV1OrdersByOrderIdResendInvoice(params),
    /**
     * Cancel an order and trigger a Stripe refund.
     * @param params.path.orderId - Order UUID
     * @param params.body.reason - Cancellation reason enum
     * @param params.body.conversation_id - Conversation UUID for identity verification
     */
    cancel: async (params) => postV1OrdersByOrderIdCancel(params)
  };
  // ─── Inventory ────────────────────────────────────────────
  /** Inventory management: check and update stock levels. */
  inventory = {
    /**
     * Get current inventory levels for a variant, SKU, or product.
     * @param params.query.variant_id - Variant UUID
     * @param params.query.sku - Product/variant SKU
     * @param params.query.product_id - Product UUID
     */
    get: async (params) => getV1Inventory(params),
    /**
     * Set or adjust inventory quantity for a variant.
     * @param params.body.variant_id - Variant UUID
     * @param params.body.quantity - Quantity value
     * @param params.body.mode - 'set' to replace, 'adjust' to add/subtract
     * @param params.body.reason - Reason for the change
     */
    update: async (params) => postV1Inventory(params)
  };
  // ─── Discounts ────────────────────────────────────────────
  /** Discount code operations: list, create, and validate promo codes. */
  discounts = {
    /**
     * List discount codes. Filter by active status or type.
     * @param params.query.active - Filter by active status
     * @param params.query.type - Filter by type (percentage, fixed_amount, free_shipping, bxgy)
     */
    list: async (params) => getV1Discounts(params),
    /**
     * Validate a discount code and calculate potential savings.
     * @param params.body.code - The discount code to validate
     * @param params.body.cart_total - Cart total for savings calculation
     * @param params.body.cart_quantity - Number of items in cart
     */
    validate: async (params) => postV1DiscountsValidate(params),
    /**
     * Create a new discount code.
     * @param params.body.code - Code text (will be uppercased)
     * @param params.body.type - Type: percentage, fixed_amount, free_shipping, bxgy
     * @param params.body.value - Discount value
     */
    create: async (params) => postV1Discounts(params)
  };
  // ─── Loyalty ──────────────────────────────────────────────
  /** Loyalty program: points balance, redemption, and referrals. */
  loyalty = {
    /**
     * Get the loyalty points balance for a contact.
     * @param params.query.contact_id - Contact UUID
     */
    getBalance: async (params) => getV1Loyalty(params),
    /**
     * Redeem loyalty points, optionally against a specific order.
     * @param params.body.contact_id - Contact UUID
     * @param params.body.points - Number of points to redeem
     * @param params.body.order_id - Order UUID to apply the redemption to
     */
    redeem: async (params) => postV1LoyaltyRedeem(params),
    /**
     * Get referral program info for a contact (link, stats, rewards).
     * @param params.query.contact_id - Contact UUID
     */
    getReferralInfo: async (params) => getV1LoyaltyReferral(params)
  };
  // ─── Gift Cards ───────────────────────────────────────────
  /** Gift card operations: list, create, and redeem gift cards. */
  giftCards = {
    /**
     * List gift cards in the workspace.
     * @param params.query.limit - Number to return (default 50)
     */
    list: async (params) => getV1GiftCards(params),
    /**
     * Create a new gift card with an initial monetary value.
     * @param params.body.initial_value - Initial value
     * @param params.body.currency - Currency code (default EUR)
     * @param params.body.code - Custom code (auto-generated if omitted)
     * @param params.body.expires_at - Expiration date (ISO 8601)
     */
    create: async (params) => postV1GiftCards(params),
    /**
     * Redeem a gift card by applying an amount against it.
     * @param params.body.code - Gift card code
     * @param params.body.amount - Amount to redeem
     * @param params.body.order_id - Order UUID to apply to
     */
    redeem: async (params) => postV1GiftCardsRedeem(params)
  };
  // ─── Tickets ──────────────────────────────────────────────
  /** Support ticket operations: list, create, read, and reply. */
  tickets = {
    /**
     * List support tickets with optional filters.
     * @param params.query.status - Filter by status (open, pending_customer, resolved, archived)
     * @param params.query.category - Filter by category
     * @param params.query.customer_email - Filter by customer email
     * @param params.query.limit - Number to return (default 20)
     */
    list: async (params) => getV1Tickets(params),
    /**
     * Get a single ticket by ID with full details.
     * @param params.path.id - Ticket UUID
     */
    get: async (params) => getV1TicketsById(params),
    /**
     * Create a new support ticket.
     * @param params.body.customer_email - Customer email
     * @param params.body.subject - Ticket subject
     * @param params.body.message - Initial message body
     * @param params.body.category - Ticket category
     * @param params.body.order_id - Related order UUID
     */
    create: async (params) => postV1Tickets(params),
    /**
     * Reply to a support ticket.
     * @param params.path.id - Ticket UUID
     * @param params.body.message - Reply message body
     */
    reply: async (params) => postV1TicketsByIdReply(params)
  };
  // ─── Subscriptions ────────────────────────────────────────
  /** Subscription management: delay or trigger shipments. */
  subscriptions = {
    /**
     * Update a subscription — delay next shipment or trigger immediate shipment.
     * @param params.path.subscriptionId - Subscription UUID
     * @param params.body.action - 'delay' or 'ship_now'
     * @param params.body.target_date - New date for delay action (ISO 8601)
     */
    update: async (params) => patchV1SubscriptionsBySubscriptionId(params)
  };
  // ─── Approvals ────────────────────────────────────────────
  /** Approval workflow: execute or reject pending approval requests. */
  approvals = {
    /**
     * Execute (approve) a pending approval request.
     * @param params.path.approvalId - Approval UUID
     */
    execute: async (params) => postV1ApprovalsByApprovalIdExecute(params),
    /**
     * Reject a pending approval request.
     * @param params.path.approvalId - Approval UUID
     * @param params.body.reason - Reason for rejection
     */
    reject: async (params) => postV1ApprovalsByApprovalIdReject(params)
  };
  // ─── Utilities ────────────────────────────────────────────
  /** Utility operations: geocoding and address resolution. */
  utils = {
    /**
     * Geocode a free-form address into coordinates and structured components.
     * @param params.query.address - The address string to geocode
     */
    geocodeAddress: async (params) => getV1UtilsGeocode(params)
  };
};
export {
  Reponse,
  client,
  deleteV1CartsByIdItemsByLineId,
  getV1CartsById,
  getV1Collections,
  getV1Discounts,
  getV1GiftCards,
  getV1Inventory,
  getV1Loyalty,
  getV1LoyaltyReferral,
  getV1Orders,
  getV1Products,
  getV1ProductsById,
  getV1Tickets,
  getV1TicketsById,
  getV1UtilsGeocode,
  patchV1OrdersByOrderIdShippingAddress,
  patchV1SubscriptionsBySubscriptionId,
  postV1ApprovalsByApprovalIdExecute,
  postV1ApprovalsByApprovalIdReject,
  postV1Carts,
  postV1CartsByIdItems,
  postV1CheckoutStripe,
  postV1Discounts,
  postV1DiscountsValidate,
  postV1GiftCards,
  postV1GiftCardsRedeem,
  postV1Inventory,
  postV1LoyaltyRedeem,
  postV1OrdersByOrderIdCancel,
  postV1OrdersByOrderIdFulfill,
  postV1OrdersByOrderIdRefund,
  postV1OrdersByOrderIdResendConfirmation,
  postV1OrdersByOrderIdResendInvoice,
  postV1Tickets,
  postV1TicketsByIdReply,
  putV1CartsByIdItemsByLineId
};
