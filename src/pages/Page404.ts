import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('page-404')
export class Page404 extends LitElement {

    render() {
        return html`<h2>404</h2>`;
    }
}