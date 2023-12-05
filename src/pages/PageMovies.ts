import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { consume } from '@lit/context';
import { contextMovieData } from '../controllers/Context';
import MovieData, { IMovie } from '../data/MovieData';
import 'data-grid-component';

@customElement('page-movies')
export class PageMovies extends LitElement {

    @consume({context: contextMovieData})
    @property({attribute: false})
    movieData: MovieData;

    @state()
    searchKey: string = "";

    @state()
    results: IMovie[] = [];

    render() {
        return html`
            <h2>Movies</h2>
            <div>
                <sl-input @sl-input=${this.onSearchInput} value=${this.searchKey} class="txtSearch"></sl-input>
                <sl-button @click=${this.onSearchClick}>Search</sl-button>
            </div>
            <div>
                <data-grid ></data-grid>
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
    }

    static styles = css`
        .txtSearch {
            width: 90%;
            margin: 1rem;
        }
    `;
}