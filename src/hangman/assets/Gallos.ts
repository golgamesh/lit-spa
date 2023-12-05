import {LitElement, html, css} from 'lit';
import {customElement } from 'lit/decorators.js';

@customElement('hangman-gallos')
export class Gallows extends LitElement {
    render() {
        return html`
            <div class="gallos">
                <div class="arm"></div>
                <div class="brace"></div>
                <div class="pole"></div>
                <div class="base"></div>
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            position: relative;
            min-height: 300px;
            width: 200px;
        }
        .arm {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 20px;
            background-color: brown;
        }
        .brace {
            position: absolute;
            top: 12px;
            left: 22px;
            width: 10px;
            height: 30px;
            transform: rotate(45deg);
            background-color: brown;
        }
        .pole {
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            height: 300px;
            background-color: brown;
        }
        .base {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200px;
            height: 20px;
            background-color: brown;
        }
    `;
}