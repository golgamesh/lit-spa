import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { delegate, emit } from '../helpers/ComponentHelpers';
import { Alphabet, HangmanState } from './Hangman';
import { repeat } from 'lit/directives/repeat.js';

export type IAlphabetEvent = CustomEvent & {
    detail: IAlphabetEventDetails;
};

export type IAlphabetEventDetails = {
    key: string;
};

@customElement('hangman-alphabet')
export class AlphabetKeyboard extends LitElement {

    @property({attribute: false, type: Array})
    pressed: string[];

    @property({type: String})
    status: HangmanState;

    connectedCallback() { 
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    buttonClick = (e: Event) => {

        const btn = e.target as HTMLButtonElement;
        const key = btn.textContent;

        emit(this, 'keypress', { key });

    }
    
    render() {
        console.log('alphabet render', this.pressed);
        return html`
            <div class="keyboard" @click=${(e: Event) => delegate(e, 'button', this.buttonClick)}>
                ${repeat(Alphabet, letter => letter, letter => html`<button .disabled=${this._pressed(letter)}>${letter}</button>`)}
            </div>
        `;
    }

    private _pressed(letter: string): boolean {
        return this.pressed.includes(letter) || this.status === HangmanState.WON || this.status === HangmanState.LOST;
    }

    static styles = css`
        :host {
            display: block;
        }

        button {
            padding: 10px;
            border-radius: 5px;
            min-width: 64px;
        }

        button:hover {
            background-color: palegreen;
        }

        button:disabled {
            background-color: coral;
        }

        .keyboard {
            display: flex;
            gap: 5px;
            max-width: 300px;
            flex-wrap: wrap;
        }
    `;
}