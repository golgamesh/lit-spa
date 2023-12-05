import { Batch } from "./Batch";
import { HttpClient, HttpVerb, IHttpOptions, IODataApiHelperOptions, IRohFetchRequestInfo, KeyValueAccessor } from "./Model";
import { combine, joinFilter, oCount, oExpand, oFilter, oJoin, oOrderBy, oParams, oSearch, oSelect, oSkip, oTop, trimJoin } from "./Utilities";

export class QueryBuilder {
    constructor(protected _options: IODataApiHelperOptions, protected _endpointPath: string, protected _client: HttpClient) {

    }

    private _select?: string[];
    private _top?: number;
    private _filter?: string;
    private _expand?: string;
    private _count?: string;
    private _verb?: HttpVerb;
    private _skip?: number;
    private _orderBy?: [string, boolean][] = [];
    private _httpOptions?: any;
    private _body?: any;
    private _search?: string;
    private _params?: [string, string | number | boolean][] = [];
    private _resolve: (val?: any) => void;
    private _reject: (reason?: any) => void;
    
    public _batch?: Batch;

    toUrlString(): string {
        return [this._endpointPath, this._buildQuery()].join('');
    }

    select(...args: string[]): QueryBuilder {
        this._select = args;
        return this;
    }

    top(top: number): QueryBuilder {
        if(this._isNonNull(top)) {
            this._top = top;
        }
        return this;
    }

    /**
     * Any number of oData filters that will
     * be joined with ' and '
     * @param filters 
     * @returns 
     */
    filter(...filters: string[]): QueryBuilder {
        this._filter = joinFilter(...filters);
        return this;
    }

    search(search: string): QueryBuilder {
        this._search = search;
        return this;
    }

    expand(expand: string): QueryBuilder {
        this._expand = expand;
        return this;
    }

    count(): QueryBuilder {
        this._count = oCount(true);
        return this;
    }

    orderBy(fieldName: string, desc = false): QueryBuilder {
        this._orderBy.push([fieldName, desc]);
        return this;
    }

    inBatch(batch: Batch): QueryBuilder {
        batch && batch.push(this);
        return this;
    }

    skip(skip: number): QueryBuilder {
        this._skip = skip;
        return this;
    }

    param(key: string, value: string | number | boolean): QueryBuilder {
        this._params.push([key, value]);
        return this;
    }

    get<T>(options?: any): Promise<T> {
        this._verb = HttpVerb.Get;
        this._httpOptions = options;

        return this._runVerb<T>();
    }

    add<T>(body?: any, options?: any): Promise<T> {
        this._verb = HttpVerb.Post;
        this._body = body;
        this._httpOptions = options;

        return this._runVerb<T>();
    }

    update<T>(body?: any, options?: any): Promise<T> {
        this._verb = HttpVerb.Patch;
        this._body = body;
        this._httpOptions = options;

        return this._runVerb<T>();
    }

    delete<T>(options?: any): Promise<T> {
        this._verb = HttpVerb.Delete;
        this._httpOptions = options;

        return this._runVerb<T>();
    }

    executeQuery<T>(verb: HttpVerb, query: string, headers?: any, body?: any): Promise<T> {
        const url = combine(this._endpointPath, query);
        const options = {
            headers:  {
                ...headers,
            }
        };
        const request: IRohFetchRequestInfo = {
            verb: verb,
            url: url,
            options: options,
            body: body
        };
        return this._executeVerb<T>(request);
    }

    protected _invokeCustomRequestHandler(requestInfo: IRohFetchRequestInfo): IRohFetchRequestInfo {
        if(this._options.onRequestHandler) {
            return this._options.onRequestHandler.call(null, requestInfo);
        }
        return requestInfo;
    }

    _execute(): Promise<any> {
        return this._executeQuery().then(result => {
            if(this._resolve) {
                this._resolve(result);
            }
        }).catch(this._reject);
    }

    protected _runVerb<T>(): Promise<T> {

        if(this._options.augmentRequest) { 
            this._options.augmentRequest.call(this, this);
        }

        if(this._batch) {
            const p = new Promise<T>((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            });

            return p;
        }

        return this._executeQuery<T>();
    }

    protected _executeQuery<T>(): Promise<T> {
        const url = this.toUrlString();
        const request: IRohFetchRequestInfo = {
            verb: this._verb,
            url: url,
            options: this._primeOptions(this._httpOptions),
            body: this._body
        };

        return this._executeVerb<T>(request);
    }

    protected _primeOptions(options?: IHttpOptions): IHttpOptions {
        return {
            headers: {},
            ...options
        }
    }

    protected _executeVerb<T>(requestInfo: IRohFetchRequestInfo): Promise<T> {
        const info = this._invokeCustomRequestHandler(requestInfo);
        const { verb, url, options, body } = info;
        const lowerVerb = verb.toLowerCase();
        return (this._client as KeyValueAccessor)[lowerVerb](url, options, body);
    }

    protected _buildQuery(): string {
        const select = oSelect.call(this._select);
        const top = oTop(this._top);
        const filter = oFilter(this._filter as any);
        const expand = oExpand(this._expand as any);
        const skip = oSkip(this._skip);
        const count = this._count as any;
        const orderBy = oOrderBy(...this._orderBy);
        const search = oSearch(this._search as any);
        const params = oParams(...this._params);
        return oJoin(select, top, filter, expand, skip, count, orderBy, search, params);
    }

    protected _isNonNull(num: any): boolean {
        if(num === null || num === undefined) {
            return false;
        }
        return true;
    }
}