import {LitElement, html, css} from 'lit';
import {customElement } from 'lit/decorators.js';

@customElement('hangman-waist')
export class Torso extends LitElement {
    render() {
        return html`<div></div>`;
    }

    static styles = css`
        :host {
            display: block;
            min-height: 20px;
            position: relative;
            background-color: blue;
            width: 35px;
        }
    `;

}