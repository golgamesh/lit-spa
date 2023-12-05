import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../hangman/Hangman';

@customElement('page-hangman')
export class PageHangman extends LitElement {

    render() {
        return html`
            <h2>Hangman</h2>
            <div>
                <hang-man></hang-man>
            </div>
        `;
    }
}