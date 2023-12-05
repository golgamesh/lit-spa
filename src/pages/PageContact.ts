import {LitElement, PropertyValueMap, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {SignalWatcher, signal, Signal} from '@lit-labs/preact-signals';
import FormController, { FormControllerOptions } from '../controllers/FormController';

type ContactMessage = {
    name: string;
    email: string;
    message: string;
};

const formFields = signal<ContactMessage>({
    name: 'Randy',
    email: 'randy@domain.com',
    message: 'Test message'
});

const FormOptions: FormControllerOptions = {
    additionalChangeEvents: ['sl-change'],
};

@customElement('page-contact')
export class PageContact extends SignalWatcher(LitElement) {

    private form = new FormController<ContactMessage>(this, formFields, FormOptions);

    connectedCallback() {
        console.log('connectedCallback');
        super.connectedCallback();
        
    }

    render() {
        console.log('render');
        return html`
            <h2>Contact</h2>
            <form>
                <label for="name">Name</label>
                <!-- <input type="text" id="name" name="name"> -->
                <label for="email">Email</label>
                <input type="email" id="email" name="email">
                <label for="message">Message</label>
                <textarea id="message" name="message"></textarea>

                <sl-input label="What is your name?" name="name"></sl-input>

                <button type="submit">Submit</button>
            </form>
            <div>

                <textarea style="height: 100px; width: 300px;">${JSON.stringify(this.form.value, null, 2)}</textarea>

            </div>
        `;
    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        super.firstUpdated(_changedProperties);
        console.log('firstUpdated');

    }

    fieldChange(e: Event, name: keyof ContactMessage) {
        const value = (e.target as HTMLInputElement).value;
        const prev = formFields.value;
        formFields.value = {...prev, [name]: value};
    }
}