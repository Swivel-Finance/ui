import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { dialogContent, DialogElement, dialogFooter, dialogHeader } from '../../../src/elements/dialog/index.js';
import { SelectElement } from '../../../src/elements/select/select.js';
import { cancel } from '../../../src/utils/events/cancel.js';
import '../../../src/elements/listbox/listbox.js';
import '../../../src/elements/listitem/listitem.js';
import '../../../src/elements/select/select.js';

export interface FeedbackResult {
    name: string;
    rating: number;
}

const options = [
    {
        label: `It's great!`,
        value: 1,
    },
    {
        label: `It's alright.`,
        value: 2,
    },
    {
        label: `It kinda sucks...`,
        value: 3,
    }
];

const template = function (this: DemoInputDialog) {

    return html`
    ${ dialogHeader(this, 'Feedback') }
    ${ dialogContent(html`
    <form @submit=${ (event: Event) => this.handleSubmit(event) }>
        <label>Name</label>
        <input type="text" name="name" autocomplete="off" @input=${ () => this.handleFeedback() }>
        <label>How's this dialog?</label>
        <ui-select @ui-value-changed=${ () => this.handleFeedback() }>
            <ui-listbox data-part="overlay">
                ${ options.map(option => html`<ui-listitem .value=${ option }>${ option.label }</ui-listitem>`) }
            </ui-listbox>
        </ui-select>
    </form>
    `) }
    ${ dialogFooter(html`
    <button type="button" @click=${ () => this.cancel(true) }>Cancel</button>
    <button type="button" class="primary" @click=${ () => this.confirm(true) }>Ok</button>
    `) }
    `;
};

@customElement('demo-input-dialog')
export class DemoInputDialog extends DialogElement<FeedbackResult> {

    protected render (): unknown {

        return template.apply(this);
    }

    /**
     * Simply prevent the form submission.
     */
    protected handleSubmit (event: Event): boolean {

        cancel(event);

        return false;
    }

    /**
     * Handle changes to the feedback form.
     *
     * @remarks
     * We simply query the values from the feedback form elements and store them
     * in the {@link DialogElement}'s `result` property. When confirming the dialog
     * the result is automatically emitted as a {@link DialogResultEvent}.
     *
     * In real life, we'd probably want to do some proper type checking and
     * validation in this handler as well.
     */
    protected handleFeedback (): void {

        const name = this.querySelector<HTMLInputElement>('form input')?.value as string;
        const rating = (this.querySelector<SelectElement>('form ui-select')?.value as typeof options[number])?.value;

        this.result = {
            name,
            rating,
        };
    }
}
