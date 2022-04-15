import { html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { SelectElement, SELECT_CONFIG_MENU, SELECT_CONFIG_MENU_RADIO } from '../../../src/elements/select/index.js';
import { amount } from '../../../src/elements/templates/amounts.js';
import '../../../src/elements/listbox/listbox.js';
import '../../../src/elements/select/select.js';

const template = function (this: SelectDemoElement): TemplateResult {

    return html`
    <h3>Select Configurations</h3>

    <div class="container horizontal third">

        <div class="vertical">
            <p>A select with the <code>DEFAULT</code> configuration.</p>
            <p>This renders a <code>button</code> with a <code>role</code> of <code>combobox</code>. The enclosed
            <code>ui-listbox</code> receives a <code>role</code> of <code>listbox</code> and the contained
            <code>ui-listitem</code>s receive a <code>role</code> of <code>option</code>.</p>
            <p>For screenreader users this will be announced similar to a normal <code>select</code> element.</p>
            <p>In addition, this select has a value preselected by rendering the <code>aria-selected</code> attribute
            into the selected list item.</p>

            <ui-select>
                <ui-listbox data-part="overlay">
                    ${ this.items.map(item => html`<ui-listitem .value=${ item } aria-selected="${ item.value === 2 }">${ item.label }</ui-listitem>`) }
                </ui-listbox>
            </ui-select>
        </div>

        <div class="vertical">
            <p>A select with the <code>MENU</code> configuration.</p>
            <p>This renders a <code>button</code> with a <code>role</code> of <code>button</code>. The enclosed
            <code>ui-listbox</code> receives a <code>role</code> of <code>menu</code> and the contained
            <code>ui-listitem</code>s receive a <code>role</code> of <code>menuitem</code>.</p>
            <p>For screenreader users this will be announced as a <code>menu popup</code>.</p>

            <ui-select .config=${ SELECT_CONFIG_MENU }>
                <ui-listbox data-part="overlay">
                    ${ this.items.map(item => html`<ui-listitem .value=${ item }>${ item.label }</ui-listitem>`) }
                </ui-listbox>
            </ui-select>
        </div>

        <div class="vertical">
            <p>A select with the <code>MENU_RADIO</code> configuration.</p>
            <p>This renders a <code>button</code> with a <code>role</code> of <code>button</code>. The enclosed
            <code>ui-listbox</code> receives a <code>role</code> of <code>menu</code> and the contained
            <code>ui-listitem</code>s receive a <code>role</code> of <code>menuitemradio</code>.</p>
            <p>For screenreader users this will be announced as a <code>menu popup</code>.</p>

            <ui-select .config=${ SELECT_CONFIG_MENU_RADIO }>
                <ui-listbox data-part="overlay">
                    ${ this.items.map(item => html`<ui-listitem .value=${ item }>${ item.label }</ui-listitem>`) }
                </ui-listbox>
            </ui-select>
        </div>

    </div>

    <h3>Customized Select</h3>

    <div class="container horizontal half">

        <div class="vertical">
            <p>A select with a custom <code>placeholder</code>, <code>triggerTemplate</code> and additional class names.</p>
            <p>The <code>triggerTemplate</code> is used to display custom information for selected entries - in this case
            the rate of the selected market. In combination with the additional class names, custom styles for this select
            instance are added in the demo's <code>main.css</code>. These styles animate the rate template between closed
            and opened state and add <code>text-overflow: ellipsis;</code> styles for the market name to gracefully handle
            larger labels. Try selecting the last market.</p>

            <ui-select class="market-select" .placeholder=${ 'Choose Market...' }
                .overlayClasses=${ ['market-select'] }
                .triggerClasses=${ ['market-select'] }
                .triggerTemplate=${ customTriggerTemplate }>
                <ui-listbox data-part="overlay">
                    ${ this.items.map(item => html`<ui-listitem .value=${ item }><span class="name">${ item.label }</span>${ amount(item.rate.toString(), '%') }</ui-listitem>`) }
                </ui-listbox>
            </ui-select>
        </div>

        <div class="vertical">
            <p>A select with a custom trigger element, using a static placeholder text and a custom icon.</p>

            <ui-select .config=${ SELECT_CONFIG_MENU_RADIO }>
                <button data-part="trigger">
                    <span class="ui-select-trigger-label">Status</span>
                    <ui-icon name="filter"></ui-icon>
                </button>
                <ui-listbox data-part="overlay">
                    ${ ['OPEN', 'CLOSED', 'ALL'].map(status => html`<ui-listitem .value=${ status }>${ status }</ui-listitem>`) }
                </ui-listbox>
            </ui-select>
        </div>

    </div>
    `;
};

const customTriggerTemplate = function (this: SelectElement): unknown {

    const market = this.value as MarketOption | undefined;

    return market !== undefined
        ? html`<span class="name">${ market.label }</span>${ amount(market.rate.toString(), '%') }`
        : this.placeholder;
};

interface MarketOption {
    label: string;
    value: number;
    rate: number;
}

@customElement('demo-select')
export class SelectDemoElement extends LitElement {

    @state()
    protected items = [
        {
            label: 'Market One',
            value: 1,
            rate: 2.35,
        },
        {
            label: 'Market Two',
            value: 2,
            rate: 3.16,
        },
        {
            label: 'Market Three',
            value: 3,
            rate: 14.72,
        },
    ];

    protected render (): unknown {

        return template.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }
}
