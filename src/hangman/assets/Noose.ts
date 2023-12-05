import {LitElement, html, css} from 'lit';
import {customElement } from 'lit/decorators.js';

@customElement('hangman-noose')
export class Noose extends LitElement {
    render() {
        return html`
            <div>
                <div class="rope"></div>
                <div class="loop"></div>
            </div>
        `;
    }
    
    static styles = css`
        :host {
            display: block;
            min-height: 100px;
            position: relative;
        }

        .rope {
            position: absolute;
            top: 0px;
            width: 10px;
            height: 50px;
            background-color: grey;
            z-index: 1;
        }

        .loop {
            position: absolute;
            top: 50px;
            left: -32px;
            border: 10px solid grey;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            z-index: 1;
        }
    `;
}