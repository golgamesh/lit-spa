import {LitElement, html, css} from 'lit';
import {customElement } from 'lit/decorators.js';

@customElement('hangman-armleft')
export class ArmLeft extends LitElement {
    render() {
        return html`<div></div>`;
    }

    
    static styles = css`
        :host {
            display: block;
            min-height: 50px;
            width: 10px;
            position: relative;
            background-color: tan;
            transform: rotate(45deg);
        }

    `;
}