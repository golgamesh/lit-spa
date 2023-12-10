import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { consume } from '@lit/context';
import { contextMovieData } from '../controllers/Context';
import MovieData, { IMovie } from '../data/MovieData';
import '../components/data-grid';
import { Config, html as cellHtml } from 'gridjs';

@customElement('page-movies')
export class PageMovies extends LitElement {

    @consume({context: contextMovieData})
    @property({attribute: false})
    movieData: MovieData;

    @state()
    searchKey: string = "";

    @state()
    results: IMovie[] = [];

    @state()
    gridConfig: Config = {} as any;

    connectedCallback(): void {
        this.setConfig();
        super.connectedCallback();
    }

    setConfig() {
        this.gridConfig = {
            columns: [
                { name: "Title" },
                { name: "Year" },
                { name: "imdbID" },
                { name: "Type" },
                { name: "Poster", formatter: (cell) => cellHtml(`<img src="${cell}">`) },
            ],
            data: this.results.map(m => [m.Title, m.Year, m.imdbID, m.Type, m.Poster])
        } as any;
    }

    render() {
        return html`
            <h2>Movies</h2>
            <div>
                <sl-input @sl-input=${this.onSearchInput} value=${this.searchKey} class="txtSearch"></sl-input>
                <sl-button @click=${this.onSearchClick}>Search</sl-button>
            </div>
            <div>
                <data-grid .config=${this.gridConfig}></data-grid>
            </div>
            <div>
                <textarea 
                    spellcheck="false" 
                    style="width: 90%; height: 500px;margin: 1rem;"
                >${JSON.stringify(this.results, null, 2)}</textarea>
            </div>
        `;
    }

    onSearchInput = (e: Event) => {
        const input = e.target as HTMLInputElement;
        console.log(input.value);
        this.searchKey = input.value;
    }

    onSearchClick = async (e: Event) => {
        this.results = await this.movieData.fetchMovieSearch(this.searchKey);
        this.setConfig();
    }

    static styles = css`
        .txtSearch {
            width: 90%;
            margin: 1rem;
        }
    `;
}