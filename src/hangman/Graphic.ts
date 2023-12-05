import {LitElement, html, css} from 'lit';
import {customElement, property } from 'lit/decorators.js';
import './assets/Gallos';
import './assets/Noose';
import './assets/Head';
import './assets/Torso';
import './assets/Waist';
import './assets/ArmLeft';
import './assets/ArmRight';
import './assets/LegRight';
import './assets/LegLeft';
import { HangmanState } from './Hangman';

@customElement('hangman-graphic')
export class Hangman extends LitElement {
    
    @property({type: Number}) 
    misses: number = 0;

    @property({type: String})
    status: HangmanState;

    render() {
        return html`
            <div>
                <hangman-gallos class=${this.misses > 0 ? '' : 'hidden'}></hangman-gallos>      <!-- 1 -->
                <hangman-noose class=${this.misses > 1 ? '' : 'hidden'}></hangman-noose>        <!-- 2 -->
                <hangman-head class=${this.misses > 2 ? '' : 'hidden'}></hangman-head>          <!-- 3 -->
                <hangman-torso class=${this.misses > 3 ? '' : 'hidden'}></hangman-torso>        <!-- 4 -->
                <hangman-waist class=${this.misses > 4 ? '' : 'hidden'}></hangman-waist>        <!-- 5 -->
                <hangman-armright class=${this.misses > 5 ? '' : 'hidden'}></hangman-armright>  <!-- 6 -->
                <hangman-armleft class=${this.misses > 6 ? '' : 'hidden'}></hangman-armleft>    <!-- 7 -->
                <hangman-legright class=${this.misses > 7 ? '' : 'hidden'}></hangman-legright>  <!-- 8 -->
                <hangman-legleft class=${this.misses > 8 ? '' : 'hidden'}></hangman-legleft>    <!-- 9 -->
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            position: relative;
            background-color: #CCC;
            min-height: 300px;
            width: 200px;
        }

        .hidden {
            display: none;
        }

        hangman-noose {
            position: absolute;
            top: 0px;
            left: 50%;
            z-index: 1;
        }

        hangman-head {
            z-index: 2;
        }

        hangman-torso {
            position: absolute;
            top: 150px;
            left: 85px;
            z-index: 2;
        }

        hangman-waist {
            position: absolute;
            top: 200px;
            left: 85px;
            z-index: 2;
        }

        hangman-armleft {
            position: absolute;
            top: 150px;
            left: 70px;
            z-index: 1;
        }

        hangman-armright {
            position: absolute;
            top: 150px;
            left: 125px;
            z-index: 1;
        }

        hangman-legright {
            position: absolute;
            top: 200px;
            left: 125px;
            z-index: 1;
        }

        hangman-legleft {
            position: absolute;
            top: 200px;
            left: 70px;
            z-index: 1;
        }
    `;

}