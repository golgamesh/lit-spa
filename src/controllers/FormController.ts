import { Signal } from '@lit-labs/preact-signals';
import { LitElement, ReactiveControllerHost } from 'lit';

export type FormControllerOptions = {
    additionalChangeEvents?: string [];
};

const DefaultOptions: FormControllerOptions = {
    additionalChangeEvents: [],
};

export default class FormController<T extends { [key: string]: any }> {
    constructor(host: ReactiveControllerHost, initialValue: T | Signal<T>, options?: FormControllerOptions) {
        this.host = host;

        // Handle if value is a Signal or an object
        this._isSignalValue = initialValue instanceof Signal;
        
        this._signalValue = this._isSignalValue ? initialValue as Signal<T> : null;
        this._value = this._isSignalValue ? null : initialValue as T;

        host.addController(this);

        this._options = { ...DefaultOptions, ...options };
    }

    protected _isSignalValue = false;
    protected _signalValue: Signal<T>;
    protected _value: T | null = null;
    protected _initialized = false;
    protected _options: FormControllerOptions;

    get value(): T {
        if (this._isSignalValue) {
            return (this._signalValue as Signal<T>).value;
        }
        return this._value as T;
    }

    private host: ReactiveControllerHost;

    hostConnected() {
        console.log('hostConnected');
        const el = this.host as LitElement;
        const { additionalChangeEvents } = this._options;
        el.renderRoot.addEventListener('change', this._onFieldChange);

        additionalChangeEvents.forEach(eventName => {
            el.renderRoot.addEventListener(eventName, this._onFieldChange);
        });

    }

    hostDisconnected() {
        const el = this.host as LitElement;
        const { additionalChangeEvents } = this._options;

        el.renderRoot.removeEventListener('change', this._onFieldChange);

        additionalChangeEvents.forEach(eventName => {
            el.renderRoot.removeEventListener(eventName, this._onFieldChange);
        });

    }

    hostUpdated() {
        console.log('hostUpdated');
        if(!this._initialized) {
            this._initialized = true;
            this._initForm();
        }
    }

    bind = (el: HTMLInputElement): string | number => {
        const fieldName = this._getFieldName(el);

        return this.value[fieldName] as string | number;

    }

    protected _initForm() {
        /*  
        const el = this.host as LitElement;
        const inputs = el.renderRoot.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const fieldName = this._getFieldName(<HTMLInputElement> input);
            const fieldValue = this.value[fieldName];

            if(fieldValue === undefined || fieldValue === null) {
                return;
            }

            switch(input.nodeName) {
                default:
                    (input as HTMLInputElement).value = fieldValue;
            }

        }); */

        const val = this.value;
        const el = this.host as LitElement;

        Object.keys(val).forEach(key => {

            const input = el.renderRoot.querySelector(`[name="${key}"],[data-fieldName="${key}"],[id="${key}"]`);
            if(!input) {
                return;
            }

            const fieldValue = val[key];

            if(fieldValue === null) {
                return;
            }

            switch(input.nodeName) {
                default:
                    (input as HTMLInputElement).value = fieldValue;
            }
        });
    }

    private _onFieldChange = (e: Event) => {
        const el = e.target as HTMLInputElement;
        const val = this._getValue(el);
        const fieldName = this._getFieldName(el);
        if (this._isSignalValue) {
            this._signalValue.value = { ...this._signalValue.value, [fieldName]: val };
            return;
        }

        (this.value as { [key: string]: any })[fieldName] = val;
        this.host.requestUpdate();
    }

    private _getFieldName(el: HTMLInputElement): string {
        return el.dataset.fieldName ||
            el.name ||
            el.getAttribute('name') ||
            el.id ||
            '';
    }

    private _getValue(el: HTMLInputElement): any {
        if (el.tagName !== "INPUT" && el.tagName !== "SELECT") {
            // Delve deeper
        }

        switch (el.type) {
            case 'checkbox':
                return el.checked;
            default:
                return el.value;
        }
    }

}