import { LitElement, html, css} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Alphabet, HangmanState } from './Hangman';
import { map } from 'lit/directives/map.js';

@customElement('hangman-secret-word')
export class SecretWord extends LitElement {
    @property({type: String})
    word: string;

    @property({attribute: false, type: Array})
    pressed: string[];

    @property({type: String})
    status: HangmanState;

    render() {
        console.log('secret word render', this.pressed);
        const letters = this.word.split('');
        return html`
            <div class="letter-group">
                ${map(letters, letter => html`
                    <div class="letter-holder">${ this._show(letter) ? letter : '' }</div>
                `)}
            </div>
        `;
    }

    private _show(letter: string): boolean {
        const upperLetter = letter.toUpperCase();
        return this.pressed.includes(upperLetter) || !Alphabet.includes(upperLetter) || this.status === HangmanState.WON || this.status === HangmanState.LOST;
    }

    static styles = css`
        :host {
        }

        .letter-group {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }

        .letter-holder {
            background-color: #eee;
            border: 1px solid #ccc;
            border-radius: 0.5rem;
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 3px solid #ccc;
        }
    `;
}
