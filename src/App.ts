import { LitElement, html } from "lit";
import {customElement, property} from 'lit/decorators.js';
import { Router } from '@lit-labs/router';
import './pages/PageHome';
import './pages/PageAbout';
import './pages/PageContact';
import './pages/Page404';
import './pages/PageHangman';
import './pages/PageMovies';
import WordData, { WordDataFactory } from "./data/WordData";
import { provide } from "@lit/context";
import { contextWordData, contextMovieData } from "./controllers/Context";
import MovieData from "./data/MovieData";

@customElement('the-app')
class App extends LitElement {
    
    private router = new Router(this, [
        { name: 'Home', path: '/', render: () => html`<page-home></page-home>` },
        { name: 'About', path: '/about', render: () => html`<page-about></page-about>`},
        { name: 'Contact', path: '/contact', render: () => html`<page-contact></page-contact>`},
        { name: 'Hang Man', path: '/hangman', render: () => html`<page-hangman></page-hangman>`},
        { name: 'Movies', path: '/movies', render: () => html`<page-movies></page-movies>`},
        { name: '404', path: '(.*)', render: () => html`<page-404></page-404>`}
    ]);

    @provide({ context: contextWordData })
    wordData: WordData = new WordData({headers: {}});

    @provide({ context: contextMovieData })
    movieData: MovieData = new MovieData({headers: {}});

    async connectedCallback() {
        await this.wordData.init();
        await this.movieData.init();
        super.connectedCallback();
    }

    render() { 
        return html`
            <header>
                <h1>APP</h1>
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/hangman">Hangman</a>
                    <a href="/movies">Movies</a>
                </nav>
            </header>
            <main>${this.router.outlet()}</main>
            <footer>...</footer>
        `;
    }
}