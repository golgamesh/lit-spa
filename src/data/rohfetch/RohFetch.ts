import { Batch } from "./Batch";
import { HttpClient, HttpVerb, IODataApiHelperOptions, KeyValueAccessor } from "./Model";
import { QueryBuilder } from "./QueryBuilder";
import { appendKey, combine } from "./Utilities";

export class RohFetch {
    constructor(protected _options: IODataApiHelperOptions, protected _client: HttpClient) {

    }

    req(endpoint: string, key?: string | number): QueryBuilder {
        const urlBuilder = new QueryBuilder(this._options, this._endpointUrl(endpoint, key), this._client);

        return urlBuilder;
    }

    createBatch(): Batch {
        return new Batch();
    }

    async executeQuery(query: string, verb: HttpVerb, headers?: any, body?: any): Promise<any> {

        const { hostUrl, pathname, headers: defaultHeaders } = this._options;
        
        const httpOptions = {
            headers: {
                ...defaultHeaders,
                ...headers,
            }
        };
        
        const lowVerb = verb.toLocaleLowerCase();

        return (this._client as KeyValueAccessor)[lowVerb](combine(hostUrl, pathname, query), httpOptions, body);

    }

    protected _parseResponse(response: Response): Promise<any> {
        return null;
    }

    protected _endpointUrl(endpoint: string, key?: string | number): string {
        const { hostUrl, pathname } = this._options;
        return appendKey(combine(hostUrl, pathname, endpoint), key);
    }

}