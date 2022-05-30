import { html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ToggleChangeEvent, ToggleTemplate } from '../../../src/elements/toggle/index.js';
import '../../../src/elements/icon/icon.js';
import '../../../src/elements/checkbox/checkbox.js';
import '../../../src/elements/toggle/toggle.js';
import '../../../src/elements/tooltip/tooltip.js';

const customIconCodeSample = `
    // create a ToggleTemplate to reference later
    const lockedThumbTemplate: ToggleTemplate = (checkbox: CheckboxElement) =>

        // add a custom class name to the ui-checkbox-thumb wrapper
        html\`<span class="ui-checkbox-thumb locked-checkbox-thumb">

            // and add the custom icon names inside the wrapper
            <ui-icon class="ui-checkbox-unchecked" name="unlock"></ui-icon>
            <ui-icon class="ui-checkbox-checked" name="lock"></ui-icon>
        </span>\`;
`;

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
                <ui-checkbox id="disabled-checkbox" aria-disabled="true"></ui-checkbox>
            </div>

        </div>

    </div>

    <div class="container vertical">

        <h3>Custom Toggle Templates</h3>

        <p>
            You can customize the track and thumb template (including the icons used for <code>ui-checkbox</code>es)
            through the <code>thumbTemplate</code> and <code>trackTemplate</code> properties:
        </p>

        <ul>
            <li>
                The <code>thumbTemplate</code> lets you customize how a toggle's "thumb" (or foreground) is rendered
            </li>
            <li>
                The <code>trackTemplate</code> lets you customize how a toggle's "track" (or background) is rendered
            </li>
        </ul>

        <p>
            Both of these properties are available on the <code>ui-toggle</code> and <code>ui-checkbox</code> elements
            and work in a very similar way (check out the default templates in <code>src/elements/toggle|checkbox</code>
            for additional guidance). For simplicity's sake, here's an example of how to set custom icons for a special
            locked/unlocked-type checkbox. First you'll need to create a custom <code>thumbTemplate</code>:
        </p>

        <pre>
    ${ customIconCodeSample }
        </pre>

        <p>
            Then, in your template, create a <code>ui-checkbox</code> and pass the custom <code>thumbTemplate</code>
            as a property:
        </p>

        <pre><xmp>
    <ui-checkbox
        class="locked-checkbox"
        .thumbTemplate=\${ lockedThumbTemplate }></ui-checkbox>
        </xmp></pre>

        <div class="container horizontal">
            <label for="locked-checkbox">Lock/Unlock</label>
            <ui-checkbox id="locked-checkbox" class="locked-checkbox" .thumbTemplate=${ lockedThumbTemplate }></ui-checkbox>
        </div>
    </div>

    <div class="container vertical">

        <h3>Toggle Events and Form Integration</h3>

        <p>
            <code>ui-toggle</code> and <code>ui-checkbox</code> elements dispatch a <code>ToggleChangeEvent</code>
            when their <code>checked</code> or <code>indeterminate</code> status changes. This is similar to a
            standard checkbox's <code>change</code> event but with a couple of additional useful properties.
            A <code>ToggleChangeEvent</code> has the following shape:
        </p>

        <pre><xmp>
    type: 'ui-toggle-changed';
    detail: {
        checked: boolean;
        indeterminate: boolean;
        value?: V;
        target: ToggleElement<V>;
    }
        </xmp></pre>

        <p>
            A standard input element's <code>change</code> event does not contain any data on the input's state, you
            generally have to query this data from the event's target. The <code>ToggleChangeEvent</code> simplifies
            this by giving you access to the full toggle state.
        </p>

        <div class="container horizontal half">

            <div class="horizontal">
                <label for="event-checkbox">Event Checkbox</label>
                <ui-checkbox id="event-checkbox" @ui-toggle-changed=${ (event: ToggleChangeEvent) => this.toggleEvent = event }></ui-checkbox>
            </div>

            <div class="vertical">
                <label>ToggleChangeEvent:</label>
                <pre style="padding:var(--line-height);">${
    this.toggleEvent
        ? JSON.stringify({
            type: this.toggleEvent.type,
            detail: {
                ...this.toggleEvent.detail,
                target: `[${ this.toggleEvent.detail.target.nodeName }]`,
            },
        }, undefined, 4)
        : ''
}</pre>
            </div>
        </div>

        <p>
            In addition, <code>ui-toggle</code> and <code>ui-checkbox</code> elements integrate with standard forms,
            making them play nice with the <code>FormData</code> API and the <code>HTMLFormElement</code> API.
        </p>

        <div class="container horizontal half">

            <form onsubmit="return false;" @input=${ () => this.handleFormChange() }>
                <div class="form-entry">
                    <label for="form-name">Name</label>
                    <input id="form-name" name="name" type="text" value="Swivel">
                </div>
                <div class="form-entry">
                    <label for="form-toggle">Notifications</label>
                    <ui-toggle id="form-toggle" name="notifications" value="on"></ui-toggle>
                </div>
            </form>

            <div class="vertical">
                <label>FormData:</label>
                <pre style="padding:var(--line-height);">${ this.formData.map(([key, value]) => html`${ key }: ${ value }\n`) }</pre>
            </div>
        </div>
    </div>
    `;
};

const lockedThumbTemplate: ToggleTemplate = () =>
    html`<span class="ui-checkbox-thumb locked-checkbox-thumb">
        <ui-icon class="ui-checkbox-unchecked" name="unlock"></ui-icon>
        <ui-icon class="ui-checkbox-checked" name="lock"></ui-icon>
    </span>`;

@customElement('demo-toggles')
export class TogglesDemoElement extends LitElement {

    @state()
    protected toggleEvent?: ToggleChangeEvent;

    @state()
    protected formData: [string, string][] = [];

    firstUpdated (): void {

        this.handleFormChange();
    }

    protected render (): unknown {

        return template.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected handleFormChange (): void {

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const data = new FormData(document.querySelector<HTMLFormElement>('form')!);

        this.formData = [];

        data.forEach((value, key) => this.formData.push([key, value as string]));
    }
}
