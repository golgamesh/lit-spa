import {LitElement, html, css, TemplateResult, nothing} from 'lit';
import {customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { IAlphabetEvent, IAlphabetEventDetails } from './Alphabet';
import './Graphic';
import './Alphabet';
import './SecretWord';
import { consume } from '@lit/context';
import WordData from '../data/WordData';
import { contextWordData } from '../controllers/Context';

export enum HangmanState {
    START = "START",
    PLAYING = "PLAYING",
    WON = "WON",
    LOST = "LOST"
}

export const Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

@customElement('hang-man')
export class Hangman extends LitElement {

    @state()
    pressed: string[] = [];

    @state()
    misses: number = 0;

    @state()
    word: string;

    @state()
    status: HangmanState = HangmanState.START;

    @state()
    maxWordLength: number = 15;
    
    @consume({context: contextWordData})
    @property({attribute: false})
    wordData: WordData;

    async connectedCallback() {
        super.connectedCallback();
        await this._setWord();
    }

    render() {
        return html`
            <div>
                <div>
                    <label for="maxWordLength">Max Word Length</label>
                    <input id="maxWordLength" type="number" min="3" max="15" value=${this.maxWordLength} @change=${this._maxWordLengthChanged} />
                </div>
                ${this._outcome()}
                <section>
                    <hangman-graphic misses=${this.misses} status=${this.status}></hangman-graphic>
                    <hangman-secret-word word=${this.word} .pressed=${this.pressed} status=${this.status}></hangman-secret-word>
                    <hangman-alphabet @keypress=${this._onKeyPress} .pressed=${this.pressed} status=${this.status}></hangman-alphabet>
                </section>
            </div>
        `;
    }

    private _maxWordLengthChanged(e: any) {
        this.maxWordLength = e.target.value;
        if(this.status !== HangmanState.WON && this.status !== HangmanState.LOST) {
            this._reset();
        }
    }

    private async _setWord() {
        this.word = await this.wordData.fetchRandomWord(this.maxWordLength);
    }

    private _outcome(): TemplateResult {
        if(this.status === HangmanState.WON || this.status === HangmanState.LOST) {
            return html`
                <div class="dialog">
                    <h1 class="gameresult">
                        ${
                            choose(this.status, [
                                [HangmanState.WON, () => html`<strong>YOU WON</strong>`],
                                [HangmanState.LOST, () => html`<strong>YOU LOST</strong>`],
                            ])
                        }
                    </h1>
                    <button @click=${() => this._reset()}>Play Again</button>
                </div>
            `;
        } else {
            return html``;
        }

    }

    private _onKeyPress = (e: IAlphabetEvent) => {
        const detail = e.detail as IAlphabetEventDetails;
        this.pressed = [...this.pressed, detail.key];
        if (!this.word.includes(detail.key.toLowerCase())) {
            this.misses++;
        }
        this._updateStatus();
    }

    private _updateStatus() {
        if (this.misses >= 9) {
            this.status = HangmanState.LOST;
        } else if (this.word.toUpperCase().split('')
                    .filter(l => Alphabet.includes(l))
                    .every(letter => this.pressed.includes(letter))) {
            this.status = HangmanState.WON;
        } else {
            this.status = HangmanState.PLAYING;
        }
    }

    private async _reset() {
        this.pressed = [];
        this.misses = 0;
        this.status = HangmanState.START;
        await this._setWord();
    }

    
    static styles = css`
        :host {

        }
        section {
            justify-content: space-around;
            gap: 3rem;
            display: flex;
        }
        .dialog {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 100;
            background-color: #CCC;
            padding: 2rem;
            transform: translate(-50%, -50%);
        }
        .gameresult {
            display: block;
            margin: 0 auto;
            width: fit-content;
        }
    `;
}