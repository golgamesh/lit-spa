import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('page-about')
export class PageAbout extends LitElement {

    render() {
        return html`<h2>About</h2>`;
    }
}