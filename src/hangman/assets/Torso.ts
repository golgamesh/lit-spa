import {LitElement, html, css} from 'lit';
import {customElement } from 'lit/decorators.js';

@customElement('hangman-torso')
export class Torso extends LitElement {
    render() {
        return html`
            <div></div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            min-height: 50px;
            position: relative;
            background-color: forestgreen;
            width: 35px;
        }
    `;
}