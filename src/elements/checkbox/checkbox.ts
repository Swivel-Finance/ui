import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { ToggleElement } from '../toggle/toggle.js';

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
    <span class="ui-checkbox-track"></span>
    <span class="ui-checkbox-thumb">
        <ui-icon class="checked" name="check"></ui-icon>
        <ui-icon class="mixed" name="minus"></ui-icon>
    </span>
    `;
};

@customElement('ui-checkbox')
export class CheckboxElement<T = unknown> extends ToggleElement<T> {

    role = 'checkbox';

    protected render (): unknown {

        return template.apply(this);
    }
}
