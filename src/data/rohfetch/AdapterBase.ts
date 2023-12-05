import { HttpVerb, IFetchAdapterRequestConfig, IHttpClientOptions, IHttpError, IHttpOptions } from "./Model";

export default abstract class AdapterBase {
    constructor(protected _options: IHttpClientOptions) {
        
        /**
         * Acess Bearer Token, keep all methods and variables 
         * pertaining to the token inside the constructor for 
         * additional protection
         */
        let _tok = "";

        this.resetKey = () => { _tok = "" };

        this._buildHeaders = (headers: { [key: string]: string }): Headers => {
            const hdr = new Headers();
            for(const key in headers) {
                hdr.append(key, headers[key]);
            }
            hdr.append("Authorization", `Bearer ${_tok}`);

            return hdr;
        }
        
        this._refreshToken = async () => {
            if(_options.fetchToken) {
                _tok = await _options.fetchToken();
            }
        }
    }

    /**
     * Delete cached access token
     * Method defined in the constructor
     */
    public resetKey: () => void;

    /**
     * Request new token
     * Method defined in the constructor
     */
    protected _refreshToken: () => Promise<void>;

    /**
     * Assemble key value pair headers object into Headers
     * Method defined in the constructor
     */
    protected _buildHeaders: (header: { [key: string]: string }) => Headers;

    /**
     * Override to provide additional initialization 
     * for the client adapter
     * @returns 
     */
    public init(): Promise<void> {
        return Promise.resolve();
    }
    
    protected abstract _fetch(requestInfo: IFetchAdapterRequestConfig): Promise<Response>;

    maxRetryCount = 2;

    get<T>(url: string, options: IHttpOptions = {}): Promise<T> {
        options.url = url;
        options.method = HttpVerb.Get;
        return this.request(options);
    }
    post<T>(url: string, options: IHttpOptions = {}, body?: any): Promise<T> {
        options.url = url;
        options.method = HttpVerb.Post;
        options.body = body;
        return this.request(options);

    }
    patch<T>(url: string, options: IHttpOptions = {}, body?: any): Promise<T> {
        options.url = url;
        options.method = HttpVerb.Patch;
        options.body = body;
        return this.request(options);
    }
    put<T>(url: string, options: IHttpOptions = {}, body?: any): Promise<T> {
        options.url = url;
        options.method = HttpVerb.Put;
        options.body = body;
        return this.request(options);
    }
    delete<T>(url: string, options: IHttpOptions = {}): Promise<T> {
        options.url = url;
        options.method = HttpVerb.Delete;
        return this.request(options);
    }

    async request<T>(options: IHttpOptions): Promise<T> {
        try {
            const requestInfo = this._adaptOptions(options, options.method, options.url, options.body);
            const response = await this._fetch(requestInfo);
            const result = await this._parseBody<T>(response);
            return result;
        } catch(err) {
            console.log('Error in get, ', err);
            await this._retryOnError(err as any);
            options.retryCount = options.retryCount || 0;
            if(options.retryCount < this.maxRetryCount) {
                options.retryCount ++;
                return this.request(options);
            }
            throw err;
        }
    }

    protected _adaptOptions(options: IHttpOptions, method?: HttpVerb | string, url?: string, body?: any): IFetchAdapterRequestConfig {
        const headers = this._buildHeaders({
            ...this._options.headers,
            ...options.headers,
        });
        const reqInfo = <IFetchAdapterRequestConfig> {
            headers: headers,
            method: method,
            signal: options.signal,
            body: body,
            credentials: "omit",
        };
        
        const req = <IFetchAdapterRequestConfig> new Request(options.url as any, reqInfo);
        req.retryCount = options.retryCount as any;
        return req;
    }

    protected async _retryOnError(error: Error | IHttpError) {

        const response = (error as IHttpError).response;
        const retryOn = [401];

        if(response) {
            const { status } = response;
                
            if(status === 401) {
                await this._refreshToken();
            }

            if(retryOn.indexOf(status) !== -1) {
                return;
            }
    
        }

        throw error;

    }


    protected async _assembleError(response: Response, err?: Error): Promise<IHttpError> {
        const body = await this._parseBody(response);
        const message = [
            `${response.status} - ${response.statusText}`,
            body ? body : "",
        ].filter(m => !!m).join('\n\n');
        const httpError: IHttpError = err || <any> new Error(message);
        httpError.response = response;

        return httpError;

    }

    protected async _parseBody<T>(response: Response): Promise<T> {
        const resultText = await response.text();
        try {
            return JSON.parse(resultText);
        } catch(err) {
            return resultText as any;
        }
    }
}