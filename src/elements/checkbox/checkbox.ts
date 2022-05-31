import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { ToggleElement, ToggleTemplate } from '../toggle/toggle.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const thumbTemplate = (checkbox: CheckboxElement): TemplateResult =>
    html`<span class="ui-checkbox-thumb">
        <ui-icon class="ui-checkbox-mixed" name="minus"></ui-icon>
        <ui-icon class="ui-checkbox-checked" name="check"></ui-icon>
    </span>`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const trackTemplate = (checkbox: CheckboxElement): TemplateResult =>
    html`<span class="ui-checkbox-track"></span>`;

const template = function (this: CheckboxElement) {

    return html`
    <input ${ ref(this.inputRef) }
        tabindex="-1"
        type="checkbox"
        id="${ this.id }"
        name="${ this.name }"
        value="${ this.value !== undefined ? String(this.value) : '' }"
        .checked=${ this.checked }
        .disabled=${ this.disabled }
        .indeterminate=${ this.indeterminate }
        @focus=${ (event: FocusEvent) => this.handleFocus(event) }
        @input=${ (event: Event) => this.handleChange(event) }
        @change=${ (event: Event) => this.handleChange(event) }>
    ${ this.trackTemplate(this) }
    ${ this.thumbTemplate(this) }
    `;
};

@customElement('ui-checkbox')
export class CheckboxElement<T = unknown> extends ToggleElement<T> {

    role = 'checkbox';

    thumbTemplate = thumbTemplate as ToggleTemplate;

    trackTemplate = trackTemplate as ToggleTemplate;

    protected render (): unknown {

        return template.apply(this);
    }
}
