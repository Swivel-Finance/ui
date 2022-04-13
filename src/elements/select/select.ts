import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SelectEvent } from '../../behaviors/list/events.js';
import { cancel } from '../../utils/events/cancel.js';
import { DeepPartial } from '../../utils/types.js';
import { MixinInput, ValueChangeEvent } from '../input/index.js';
import { ListBoxElement } from '../listbox/index.js';
import { PopupElement } from '../popup/index.js';
import { SelectConfig, SELECT_CONFIG_DEFAULT } from './config.js';
import '../icon/icon.js';

const MISSING_LISTBOX = () => new Error('Missing element: A <ui-select> element needs to contain a <ui-listbox> element.');

const template = function (this: SelectElement) {

    const role = (this.config.overlay.role === 'listbox')
        ? 'combobox'
        : 'button';

    return html`
    <button type="button" role=${ role } data-part="trigger">
        <span class="ui-select-trigger-label">
            ${ this.triggerTemplate.apply(this) }
        </span>
        <ui-icon name="angle-right-b"></ui-icon>
    </button>
    `;
};

@customElement('ui-select')
export class SelectElement extends MixinInput(PopupElement) {

    protected _config = SELECT_CONFIG_DEFAULT;

    protected listbox!: ListBoxElement;

    @property({ attribute: false })
    set config (value: DeepPartial<SelectConfig>) {

        const previous = this.config;

        this._config = {
            classes: {
                ...this._config.classes,
                ...value.classes,
            },
            focus: {
                ...this._config.focus,
                ...value.focus,
            },
            position: {
                ...this._config.position,
                ...value.position,
            },
            trigger: {
                ...this._config.trigger,
                ...value.trigger,
            },
            overlay: {
                ...this._config.overlay,
                ...value.overlay,
            },
            list: {
                ...this._config.list,
                ...value.list,
            },
        };

        this.requestUpdate('config', previous);
    }

    get config (): SelectConfig {

        return this._config;
    }

    @property({ attribute: false })
    triggerTemplate = function (this: SelectElement): unknown {

        const label = (this.value as { label: string })?.label || String(this.value ?? '');

        return html`${ label || this.placeholder }`;
    };

    @property()
    placeholder = 'Select...';

    connectedCallback (): void {

        this.listbox = this.querySelector('ui-listbox') as ListBoxElement;

        if (!this.listbox) throw MISSING_LISTBOX();

        // TODO: this needs to update when we change the config property
        this.listbox.config = this.config.list;

        super.connectedCallback();
    }

    protected firstUpdated (): void {

        super.firstUpdated();

        this.value = this.listbox.value;
    }

    protected render (): unknown {

        return template.apply(this);
    }

    protected addListeners (): void {

        super.addListeners();

        this.eventManager.listen(this.listbox, 'ui-select-item', event => this.handleSelection(event as SelectEvent));
        this.eventManager.listen(this.listbox, 'ui-value-changed', event => this.handleValueChange(event as ValueChangeEvent));
    }

    protected handleSelection (event: SelectEvent): void {

        // only handle events from the select's listbox
        if (event.detail.target !== this.listbox) return;

        // the `SelectEvent` also fires when selecting an already selected item
        void this.hide(true);
    }

    protected handleValueChange (event: ValueChangeEvent): void {

        // only handle events from the select's listbox
        if (event.detail.target !== this.listbox) return;

        // we cancel the listbox's `ValueChange` event
        cancel(event);

        // store the new value in the select
        this.value = this.listbox.value;

        // and dispatch our own `ValueChange` event
        this.dispatchValueChange();
    }
}
