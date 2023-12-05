import {LitElement, html, css} from 'lit';
import {customElement } from 'lit/decorators.js';

@customElement('hangman-armright')
export class ArmRight extends LitElement {

    render() {
        return html`<div></div>`;
    }

    static styles = css`
        :host {
            display: block;
            min-height: 20px;
            position: relative;
            background-color: tan;
            width: 10px;
            height: 50px;
            transform: rotate(-45deg);
        }
    `;

}