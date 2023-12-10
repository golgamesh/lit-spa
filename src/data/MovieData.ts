import { 
    Batch, 
    FetchAdapter, 
    FetchAdapterFactory, 
    HttpClient, 
    IHttpClientOptions, 
    IODataApiHelperOptions, 
    IRohFetchRequestInfo, 
    QueryBuilder, 
    RohFetch, 
    first
} from "./rohfetch";

const ApiKey = "391a2fbc";
const CorsProxyHost = "https://corsproxy.io";

export interface IResponse<T> {
    Response: string;
    Search: T[];
    totalResults: string;
}

export interface IMovie { 
    
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;

}

export default class MovieData {
    constructor(protected _clientOptions: IHttpClientOptions) {

    }

    client: HttpClient;
    data: RohFetch;
    
    async init() {
        this.client = await FetchAdapterFactory(this._clientOptions);
        const helperOptions = <IODataApiHelperOptions> {
            hostUrl: 'https://www.omdbapi.com',
            pathname: '/',
            onRequestHandler: (requestInfo: IRohFetchRequestInfo) => {
                requestInfo.url = `${CorsProxyHost}?${encodeURIComponent(requestInfo.url)}`;
                return requestInfo;
            },
            augmentRequest: (query: QueryBuilder) => query.param('apikey', ApiKey),
        };
        this.data = new RohFetch(helperOptions, this.client);
    }

    async fetchMovieSearch(key?: string): Promise<IMovie[]> {
    
        const response = await this.data.req('').param('s', key).get<IResponse<IMovie>>();
        return response.Search;

    }

}

export async function MovieDataFactory(options: IHttpClientOptions): Promise<MovieData> {
    const data = new MovieData(options);
    await data.init();
    return data;
}
