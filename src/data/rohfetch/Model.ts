import { QueryBuilder } from "./QueryBuilder";

export interface IODataErrorResponse {
    message: string;
    exceptionMessage: string;
    exceptionType: string;
    stackTrace: string; 
}

export interface IHttpError {
    type: string;
    title: string;
    status: number;
    traceId: string;
    errors: {
        [key: string]: string;
    };
}

export interface IODataApiHelperOptions {
    hostUrl: string;
    pathname: string;
    headers: { [key: string]: string };
    onRequestHandler?: (requestInfo: IRohFetchRequestInfo) => IRohFetchRequestInfo;
    augmentRequest?: (query: QueryBuilder) => QueryBuilder;
}

export interface IRohFetchRequestInfo {
    verb: HttpVerb;
    url: string;
    options?: IHttpOptions;
    body?: any;
}

export interface IHttpOptions {
    method?: HttpVerb | string;
    headers?: { [key: string]: string; };
    signal?: AbortSignal;
    //client: HttpClient;
    retryCount?: number;
    url?: string;
    body?: any;
}

export interface KeyValueAccessor {
    [key: string]: any;
}

export abstract class HttpClient {
    abstract get<T>(url: string, options?: IHttpOptions): Promise<T>;
    abstract post<T>(url: string, options?: IHttpOptions, body?: any): Promise<T>;
    abstract patch<T>(url: string, options?: IHttpOptions, body?: any): Promise<T>;
    abstract put<T>(url: string, options?: IHttpOptions, body?: any): Promise<T>;
    abstract delete<T>(url: string, options?: IHttpOptions): Promise<T>;
}

export interface IHttpError extends Error {
    response?: Response;
}

export interface IHttpClientOptions {
    headers: { [key: string]: string }
    fetchToken?: () => Promise<string>;
}

export interface IFetchAdapterRequestConfig extends Request {
    retryCount: number;
}

export enum HttpVerb {
    Get = "GET",
    Post = "POST",
    Patch = "PATCH",
    Delete = "DELETE",
    Put = "PUT",
}