import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement('page-home')
export class PageHome extends LitElement {

    render() {
        return html`
            <h2>Home</h2>

            <sl-button>Button</sl-button>
        `;
    }
}