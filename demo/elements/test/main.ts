import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../../src/elements/icon/icon.js';
import '../../../src/elements/listbox/listbox.js';
import '../../../src/elements/popup/popup.js';

@customElement('sw-test')
export class TestElement extends LitElement {

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return html`
        <ui-popup>
            <button type="button" data-part="trigger">Edit</button>
            <div data-part="overlay">
                <input type="text" placeholder="Whatever...">
                <ui-listbox>
                    <ui-listitem>0%</ui-listitem>
                    <ui-listitem>25%</ui-listitem>
                    <ui-listitem>50%</ui-listitem>
                    <ui-listitem>75%</ui-listitem>
                    <ui-listitem>100%</ui-listitem>
                </ui-listbox>
                <div class="controls">
                    <button type="button">Cancel</button>
                    <button type="button">Confirm</button>
                </div>
            </div>
        </ui-popup>
        `;
    }
}


const template = function (this: TestDemoElement): TemplateResult {

    return html`
    <sw-test></sw-test>
    `;
};

@customElement('demo-test')
export class TestDemoElement extends LitElement {

    protected render (): unknown {

        return template.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }
}
