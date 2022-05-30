import { ComplexAttributeConverter, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { setAttribute } from '../../utils/dom/index.js';
import { cancel, dispatch, EventManager, MappedAddEventListener, MappedRemoveEventListener } from '../../utils/events/index.js';
import { ENTER, SPACE } from '../../utils/keys.js';
import { ToggleChangeEvent, ToggleElementEventMap } from './events.js';

const ariaBool: ComplexAttributeConverter<boolean> = {
    fromAttribute: (value) => value?.toLowerCase() === 'true',
    toAttribute: (value) => value ? 'true' : 'false',
};

const ariaChecked: ComplexAttributeConverter<boolean | 'mixed'> = {
    fromAttribute: (value) => value?.toLowerCase() === 'mixed'
        ? 'mixed'
        : value?.toLowerCase() === 'true',
    toAttribute: (value) => value === 'mixed'
        ? value
        : value ? 'true' : 'false',
};

export type ToggleTemplate = <T extends ToggleElement>(toggle: T) => TemplateResult | undefined;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const thumbTemplate = (toggle: ToggleElement): TemplateResult => html`<span class="ui-toggle-thumb"></span>`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const trackTemplate = (toggle: ToggleElement): TemplateResult => html`<span class="ui-toggle-track"></span>`;

/**
 * ToggleElement template
 *
 * @remarks
 * We render an actual checkbox into the template, but we visually hide it. By having a checkbox:
 * - we can use a toggle inside a form element and the FormData will include the toggle's value
 * - we can use a label element and link it to the checkbox, which keeps the native behavior of
 *   toggling the checkbox value if the label is clicked (we listen for checkbox changes)
 */
const template = function (this: ToggleElement) {

    return html`
    <input ${ ref(this.inputRef) }
        tabindex="-1"
        type="checkbox"
        id="${ this.id }"
        name="${ this.name }"
        value="${ this.value !== undefined ? String(this.value) : '' }"
        .checked=${ this.checked }
        .disabled=${ this.disabled }
        @focus=${ (event: FocusEvent) => this.handleFocus(event) }
        @input=${ (event: Event) => this.handleChange(event) }
        @change=${ (event: Event) => this.handleChange(event) }>
    ${ this.trackTemplate(this) }
    ${ this.thumbTemplate(this) }
    `;
};

@customElement('ui-toggle')
export class ToggleElement<T = unknown> extends LitElement {

    // we have a bunch of internal properties which are shadowed by a public
    // getter/setter pair - this is the only reason we are using underscores

    protected _id = '';

    protected _tabindex = 0;

    protected _checked = false;

    protected _indeterminate = false;

    protected eventManager = new EventManager();

    protected inputRef = createRef<HTMLInputElement>();

    /**
     * The toggle's id
     *
     * @remarks
     * When setting the id on the ToggleElement, we immeadiately remove it from
     * the toggle and add it to the owned checkbox instead. This is so label
     * elements can refer to the actual underlying checkbox.
     */
    @property({
        attribute: true,
        reflect: false,
    })
    set id (id: string) {

        const previous = this.id;

        this.removeAttribute('id');

        this._id = id;

        this.requestUpdate('id', previous);
    }

    get id (): string {

        return this._id;
    }

    @property({
        attribute: true,
        reflect: true,
    })
    role = 'switch';

    @property({
        attribute: true,
        reflect: true,
    })
    name: string | null = null;

    /**
     * The toggle's value.
     *
     * @remarks
     * Checkboxes and radios can have values independent of their `checked` state.
     * This value will be included in FormData if the input is checked adn omitted
     * otherwise. The ToggleElement can have an arbitrary value, however, when
     * mirroring this value to the owned checkbox, it will be stringified.
     * In these cases, make sure to get the `value` from the toggle instance instead
     * of the FormData.
     */
    @property()
    value!: T;

    @property({
        attribute: 'aria-checked',
        reflect: false,
        converter: ariaChecked,
    })
    set checked (value: boolean | 'mixed') {

        if (this._checked === value || this.indeterminate && value === 'mixed') return;

        const previous = this._checked;

        // the aria-checked attribute can be true | false | 'mixed'

        // `checked` is only true if aria-checked is true
        this._checked = value === true;

        // `indeterminate` is true if aria-checked is 'mixed'
        this.indeterminate = value === 'mixed';

        this.requestUpdate('checked', previous);
    }

    get checked (): boolean {

        return this._checked;
    }

    @property({
        attribute: false,
        reflect: false,
        type: Boolean,
    })
    set indeterminate (value: boolean) {

        if (this._indeterminate === value) return;

        const previous = this._indeterminate;

        this._indeterminate = value;

        // an indeterminate toggle's `checked` property is always `false`
        this.checked = value ? false : this.checked;

        this.requestUpdate('indeterminate', previous);
    }

    get indeterminate (): boolean {

        return this._indeterminate;
    }

    @property({
        attribute: 'aria-disabled',
        reflect: true,
        converter: ariaBool,
    })
    disabled = false;

    @property({
        attribute: true,
        reflect: false,
        type: Number,
    })
    set tabindex (value: number) {

        if (this._tabindex === value) return;

        const previous = this._tabindex;

        this._tabindex = value;

        this.requestUpdate('tabindex', previous);
    }

    get tabindex (): number {

        // if the toggle is disabled, always return -1
        return this.disabled ? -1 : this._tabindex;
    }

    @property({
        attribute: false,
    })
    thumbTemplate: ToggleTemplate = thumbTemplate;

    @property({
        attribute: false,
    })
    trackTemplate: ToggleTemplate = trackTemplate;

    connectedCallback (): void {

        super.connectedCallback();

        this.addListeners();
    }

    disconnectedCallback (): void {

        this.removeListeners();

        super.disconnectedCallback();
    }

    toggle (interactive = false): void {

        if (interactive) {

            // we want to forward the click to the owned checkbox to ensure it
            // dispatches its change event to any parent form
            this.inputRef.value?.click();

            this.dispatchToggleChange();

        } else {

            this.checked = !this.checked;
        }
    }

    /**
     * @remarks
     * The `aria-checked` and `tabindex` attributes depend on the values of some
     * getters, as they are derived from multiple underlying properties. So we
     * have to manually relfect them on every update.
     */
    protected updated (): void {

        setAttribute(this, 'aria-checked', this.indeterminate ? 'mixed' : this.checked);

        setAttribute(this, 'tabindex', this.tabindex);

        // as the clickable label is referencing the owned input element, we need to ensure
        // screen readers still announce the label text if the toggle is focused
        if (!this.hasAttribute('aria-labelledby') && !this.hasAttribute('aria-label') && this.id) {

            const label = document.querySelector<HTMLLabelElement>(`label[for=${ this.id }]`);
            const text = label?.innerText;

            if (text) setAttribute(this, 'aria-label', label?.innerText);
        }
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return template.apply(this);
    }

    protected addListeners (): void {

        this.eventManager.listen(this, 'click', event => this.handleClick(event as MouseEvent));
        this.eventManager.listen(this, 'keydown', event => this.handleKeyDown(event as KeyboardEvent));
    }

    protected removeListeners (): void {

        this.eventManager.unlistenAll();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleClick (event: MouseEvent): void {

        if (this.disabled) return;

        this.toggle(true);
    }

    protected handleKeyDown (event: KeyboardEvent): void {

        if (this.disabled) return;

        switch (event.key) {

            case ENTER:
            case SPACE:

                cancel(event);

                this.toggle(true);

                break;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleFocus (event: FocusEvent): void {

        this.focus();
    }

    protected handleChange (event: Event): void {

        const target = event.target as HTMLInputElement;

        if (target && this.inputRef.value === target) {

            this.checked = target.checked;
        }
    }

    protected dispatchToggleChange (): void {

        const event = new ToggleChangeEvent({
            target: this,
            value: this.value,
            checked: this.checked,
            indeterminate: this.indeterminate,
        });

        dispatch(this, event);
    }
}

export interface ToggleElement<T = unknown> {
    addEventListener: MappedAddEventListener<ToggleElement<T>, ToggleElementEventMap<T>>;
    removeEventListener: MappedRemoveEventListener<ToggleElement<T>, ToggleElementEventMap<T>>;
}
