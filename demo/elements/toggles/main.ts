import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../../src/elements/checkbox/checkbox.js';
import '../../../src/elements/icon/icon.js';
import '../../../src/elements/toggle/toggle.js';
import '../../../src/elements/tooltip/tooltip.js';

const template = function (this: TogglesDemoElement): TemplateResult {

    return html`
    <div class="container horizontal half">

        <div class="vertical">

            <h3>Toggle Variations</h3>

            <div class="container horizontal">
                <label for="unchecked-toggle">Unchecked</label>
                <ui-toggle id="unchecked-toggle" aria-describedby="unchecked-toggle-tooltip"></ui-toggle>
                <ui-tooltip id="unchecked-toggle-tooltip">This switch turns on and off...</ui-tooltip>
            </div>

            <div class="container horizontal">
                <label for="checked-toggle">Checked</label>
                <ui-toggle id="checked-toggle" aria-checked="true"></ui-toggle>
            </div>

            <div class="container horizontal">
                <label for="disabled-toggle">Disabled</label>
                <ui-toggle id="disabled-toggle" aria-disabled="true"></ui-toggle>
            </div>

        </div>

        <div class="vertical">

            <h3>Checkbox Variations</h3>

            <div class="container horizontal">
                <label for="checked-checkbox">Unchecked</label>
                <ui-checkbox id="checked-checkbox" aria-describedby="checked-checkbox-tooltip"></ui-checkbox>
                <ui-tooltip id="checked-checkbox-tooltip">This checkbox can be checked, unchecked and mixed...</ui-tooltip>
            </div>

            <div class="container horizontal">
                <label for="unchecked-checkbox">Checked</label>
                <ui-checkbox id="unchecked-checkbox" aria-checked="true"></ui-checkbox>
            </div>

            <div class="container horizontal">
                <label for="mixed-checkbox">Mixed</label>
                <ui-checkbox id="mixed-checkbox" aria-checked="mixed"></ui-checkbox>
            </div>

            <div class="container horizontal">
                <label for="disabled-checkbox">Disabled</label>
                <ui-checkbox for="disabled-checkbox" aria-disabled="true"></ui-checkbox>
            </div>

        </div>

    </div>
    `;
};

@customElement('demo-toggles')
export class TogglesDemoElement extends LitElement {

    protected render (): unknown {

        return template.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }
}
