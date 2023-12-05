import {LitElement, html, css} from 'lit';
import {customElement } from 'lit/decorators.js';

@customElement('hangman-head')
export class Head extends LitElement {
    render() {
        return html`
            <div class="head">
                    <div class="eye-l"></div>
                    <div class="eye-r"></div>
                    <div class="mouth"></div>
                </div>
                <div class="neck"></div>
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            position: absolute;
            top: 50px;
            left: 50px;
            width: 100px;
            height: 100px;
            background-color: tan;
            border-radius: 50%;
        }

        .eye-l {
            position: absolute;
            top: 30px;
            left: 30px;
            width: 5px;
            height: 5px;
            background-color: #333;
            border-radius: 50%;
        }

        .eye-r {
            position: absolute;
            top: 30px;
            right: 30px;
            width: 5px;
            height: 5px;
            background-color: #333;
            border-radius: 50%;
        }

        .mouth {
            position: absolute;
            top: 60px;
            left: 20px;
            width: 60px;
            height: 20px;
            background-color: #333;
            border-radius: 50%;
        }

    `;
}