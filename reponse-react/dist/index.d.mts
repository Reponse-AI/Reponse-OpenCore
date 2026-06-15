import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import * as _reponse_sdk from '@reponse/sdk';
import { ReponseOptions, Reponse } from '@reponse/sdk';
import * as swr from 'swr';

declare function ReponseProvider({ children, ...options }: ReponseOptions & {
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useReponse(): Reponse;

declare function useProducts(params?: {
    query?: string;
    slug?: string;
    limit?: number;
    cursor?: string;
}): swr.SWRResponse<{
    data: _reponse_sdk.ProductListResponse;
    request: Request;
    response: Response;
} | (({
    data: _reponse_sdk.ProductListResponse;
    error: undefined;
} | {
    data: undefined;
    error: unknown;
}) & {
    request?: Request;
    response?: Response;
}), any, any>;
declare function useProduct(id: string): swr.SWRResponse<{
    data: _reponse_sdk.Product;
    request: Request;
    response: Response;
} | (({
    data: _reponse_sdk.Product;
    error: undefined;
} | {
    data: undefined;
    error: unknown;
}) & {
    request?: Request;
    response?: Response;
}), any, any>;
declare function useCollections(params?: {
    limit?: number;
}): swr.SWRResponse<{
    data: _reponse_sdk.CollectionListResponse;
    request: Request;
    response: Response;
} | (({
    data: undefined;
    error: unknown;
} | {
    data: _reponse_sdk.CollectionListResponse;
    error: undefined;
}) & {
    request?: Request;
    response?: Response;
}), any, any>;
declare function useCart(cartId: string | null): {
    data: {
        data: _reponse_sdk.Cart;
        request: Request;
        response: Response;
    } | (({
        data: _reponse_sdk.Cart;
        error: undefined;
    } | {
        data: undefined;
        error: unknown;
    }) & {
        request?: Request;
        response?: Response;
    }) | undefined;
    error: any;
    isLoading: boolean;
    mutate: swr.KeyedMutator<{
        data: _reponse_sdk.Cart;
        request: Request;
        response: Response;
    } | (({
        data: _reponse_sdk.Cart;
        error: undefined;
    } | {
        data: undefined;
        error: unknown;
    }) & {
        request?: Request;
        response?: Response;
    })>;
    addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
    updateItem: (lineId: string, quantity: number) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
};

export { ReponseProvider, useCart, useCollections, useProduct, useProducts, useReponse };
