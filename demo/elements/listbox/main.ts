import { html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { ListConfig, ListEntryLocator, LIST_CONFIG_MENU, LIST_CONFIG_MENU_RADIO } from '../../../src/behaviors/list/index.js';
import { ValueChangeEvent } from '../../../src/elements/input/events.js';
import { ListBoxElement } from '../../../src/elements/listbox/index.js';
import '../../../src/elements/icon/icon.js';
import '../../../src/elements/listbox/listbox.js';
import '../../../src/elements/listitem/listitem.js';

const template = function (this: ListboxDemoElement): TemplateResult {

    return html`
    <h3>Listbox</h3>

    <p>This example shows a listbox rendered by a parent component. The list items are rendered from an array of objects
        using <code>map</code> and assign the mapped object to the list item's <code>value</code> property. Each list
        item has a custom template containing an icon component, which is derived from the value object.</p>

    <div class="container horizontal half">

        <ui-listbox @ui-value-changed=${ (event: ValueChangeEvent) => this.handleValueChange(event) } ${ ref(this.listbox) }>
            ${ this.values.map(value => html`<ui-listitem .value=${ value }>
                <ui-icon name="${ value.icon }"></ui-icon>${ value.label }
            </ui-listitem>`) }
        </ui-listbox>

        <dl class="vertical">
            <dt><code>value</code></dt>
            <dd>
                <pre>${ JSON.stringify(this.selected, undefined, 2) }</pre>
            </dd>
        </dl>
    </div>

    <h3>Menu</h3>

    <p>This example shows a listbox rendered by a parent component using a custom <code>ListConfig</code> to configure
        the listbox as a <code>menu</code> with <code>menuitemradio</code> items. Disabled list items can be marked
        using the <code>aria-disabled</code> attribute and will be excluded from selection and keyboard navigation.</p>

    <div class="container horizontal half">

        <ui-listbox .config=${ this.menuConfig } @ui-value-changed=${ (event: ValueChangeEvent) => this.handleValueChange(event) } ${ ref(this.menu) }>
            <ui-listitem .value=${ 'one' }>Menu Item One</ui-listitem>
            <ui-listitem .value=${ 'two' }>Menu Item Two</ui-listitem>
            <ui-listitem .value=${ 'three' }>Menu Item Three</ui-listitem>
            <ui-listitem .value=${ 'four' } aria-disabled="true">Menu Item Four</ui-listitem>
            <ui-listitem .value=${ 'five' }>Menu Item Five</ui-listitem>
        </ui-listbox>

        <dl class="vertical">
            <dt><code>value</code></dt>
            <dd>
                <pre>${ JSON.stringify(this.menu.value?.value, undefined, 2) }</pre>
            </dd>
        </dl>
    </div>

    <h3>Horizontal Menu</h3>

    <p>This example shows two listboxes rendered by a parent component using a custom <code>ListConfig</code> to
        configure each listbox as a <code>menu</code> with <code>menuitem</code> items and an <code>orientation</code>
        of <code>'vertical'</code>.</p>

    <div class="container horizontal half button-menus">

        <div class="vertical">

            <p>A button menu.</p>

            <ui-listbox .config=${ this.buttonsConfig }>
                <ui-listitem .value=${ 'one' }>One</ui-listitem>
                <ui-listitem .value=${ 'two' }>Two</ui-listitem>
                <ui-listitem .value=${ 'three' }>Three</ui-listitem>
                <ui-listitem .value=${ 'four' } aria-disabled="true">Four</ui-listitem>
                <ui-listitem .value=${ 'five' }>Five</ui-listitem>
            </ui-listbox>
        </div>

        <div class="vertical">

            <p>A button menu with small buttons. The first button is marked as initially selected using the
                <code>aria-selected</code> attribute.</p>

            <ui-listbox .config=${ this.buttonsConfig }>
                <ui-listitem class="button-small" .value=${ '' } aria-selected="true">OFF</ui-listitem>
                <ui-listitem class="button-small" .value=${ 'ma' }>MA</ui-listitem>
                <ui-listitem class="button-small" .value=${ 'ema' }>EMA</ui-listitem>
                <ui-listitem class="button-small" .value=${ 'sar' }>SAR</ui-listitem>
                <ui-listitem class="button-small" .value=${ 'vol' }>VOL</ui-listitem>
            </ui-listbox>
        </div>

    </div>

    <h3>Updating a Listbox</h3>

    <div class="container horizontal half">

        <div class="container vertical update-form">

            <ui-listbox @ui-value-changed=${ () => this.requestUpdate() } ${ ref(this.updateable) }>
                <ui-listitem .value=${ 'one' }>One</ui-listitem>
                <ui-listitem .value=${ 'two' }>Two</ui-listitem>
                <ui-listitem .value=${ 'three' }>Three</ui-listitem>
                <ui-listitem .value=${ 'four' } aria-disabled="true">Four</ui-listitem>
                <ui-listitem .value=${ 'five' }>Five</ui-listitem>
            </ui-listbox>

            <div class="vertical">

                <label>Current value</label>

                <pre>${ this.updateable.value?.value ?? 'undefined' }</pre>

                <label for="item-locator">
                    Select a list item by index (0, 1, ...) <br/>or locator (first, next, ...)
                </label>

                <input id="item-locator" type="text" placeholder="0, 1, ... or first, next, ..." ${ ref(this.input) }>

                <div class="horizontal half">
                    <button type="button" @click=${ () => this.setActive() }>setActive</button>
                    <button type="button" @click=${ () => this.setSelected() }>setSelected</button>
                    <button type="button" @click=${ () => this.reset() }>reset</button>
                </div>
            </div>
        </div>

        <div class="container vertical">
            <p>
                Setting the value of a <code>ui-listbox</code> is not totally straight forward, as the list box derives
                its value from the currently selected <code>ui-listitem</code>. A list item can specify its value through
                either a <code>value</code> property or a <code>data-value</code> attribute. Whenever the underlying
                list behavior dispatches a selection event, the list box reads the property/attribute from the selected
                list item and updates its value property.
            </p>
            <p>
                Doing the same in reverse can be tricky, especially for <code>undefined</code> values (is the
                <code>value</code> property in the list item simply not set or actually <code>undefined</code>) and
                <code>object</code> values (which might require deep property checking for equality checks if the value
                instances can't be guaranteed to be the same).
            </p>
            <p>
                For this reason, the <code>ui-listbox</code> proxies some the underlying
                <code><a href="../../behaviors/list">ListBehavior</a></code>'s API:
            </p>
            <ul>
                <li>
                    <code>setActive</code>: Set the active list item by item index, item reference (the actual dom element)
                    or a "locator" string (like "previous", "next", "first", "last", "current").
                </li>
                <li>
                    <code>setSelected</code>: Set the selected list item by item index, item reference (the actual dom element)
                    or a "locator" string (like "previous", "next", "first", "last", "current").
                </li>
                <li>
                    <code>reset</code>: Reset the active list item to the first item and clear any selection.
                </li>
            </ul>
        </div>
    </div>

    `;
};

@customElement('demo-listbox')
export class ListboxDemoElement extends LitElement {

    protected listbox = createRef<ListBoxElement>();

    protected menu = createRef<ListBoxElement>();

    protected updateable = createRef<ListBoxElement>();

    protected input = createRef<HTMLInputElement>();

    protected values = [
        {
            id: 0,
            label: 'Info',
            icon: 'info',
        },
        {
            id: 1,
            label: 'Success',
            icon: 'check',
        },
        {
            id: 2,
            label: 'Warning',
            icon: 'exclamation',
        },
        {
            id: 3,
            label: 'Error',
            icon: 'times',
        },
    ];

    protected menuConfig: Partial<ListConfig> = {
        ...LIST_CONFIG_MENU_RADIO,
    };

    protected buttonsConfig: Partial<ListConfig> = {
        ...LIST_CONFIG_MENU,
        orientation: 'horizontal',
    };

    @state()
    protected selected: unknown;

    protected render (): unknown {

        return template.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected handleValueChange (event: ValueChangeEvent): void {

        if (!event.detail.change) return;

        if (event.detail.target === this.listbox.value) {

            this.selected = event.detail.current;
        }

        this.requestUpdate();
    }

    protected setActive (): void {

        const value = this.input.value?.value ?? '';
        const index = parseInt(value);
        const item = isNaN(index) ? value as ListEntryLocator : index;

        this.updateable.value?.setActive(item, true);
    }

    protected setSelected (): void {

        const value = this.input.value?.value ?? '';
        const index = parseInt(value);
        const item = isNaN(index) ? value as ListEntryLocator : index;

        this.updateable.value?.setSelected(item, true);
    }

    protected reset (): void {

        this.updateable.value?.reset(true);
    }
}
