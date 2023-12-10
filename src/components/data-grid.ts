import {LitElement, PropertyValueMap, html, css, unsafeCSS } from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { Grid, Config } from "gridjs";

import gridstyles from 'gridjs/dist/theme/mermaid.css?inline';

@customElement('data-grid')
export class DataGrid extends LitElement {

    private _config: Config;

    @property({ hasChanged: (value, oldValue) => value != oldValue })
    get config(): Config {
        return this._config;
    }

    set config(value: Config) {

        const oldValue = this._config;
        this._config = value;

        if(this.grid && oldValue != value) {
            this.grid
                .updateConfig(this.config)
                .forceRender();
        }
    }

    @state()
    protected grid: Grid;

    connectedCallback() {
        super.connectedCallback();
        this.grid = new Grid(this.config);
    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this.grid.render(this.renderRoot.querySelector(".grid-root"));
    }

    attributeChangedCallback(name: string, _old: string, value: string): void {
        this.grid.updateConfig(this.config);
    }

    render() {
        return html`
            <div class="grid-root"></div>
        `;
    }

    static styles = [unsafeCSS(gridstyles), css`

    `];
}