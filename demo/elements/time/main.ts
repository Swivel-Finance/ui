import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ValueChangeEvent } from '../../../src/elements/input/events.js';
import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from '../../../src/utils/date/constants.js';
import { SECONDS_PER_DAY } from '../market-selector/market.js';

import '../../../src/elements/listbox/listbox.js';
import '../../../src/elements/listitem/listitem.js';
import '../../../src/elements/select/select.js';
import '../../../src/elements/time/time-ago.js';

interface TimeOption {
    value: number;
    label: string;
}

const options: TimeOption[] = [
    { value: 0, label: 'Now' },
    { value: 1, label: 'A few minutes ago' },
    { value: 2, label: 'An hour ago' },
    { value: 3, label: 'A few hours ago' },
    { value: 4, label: 'A day ago' },
    { value: 5, label: 'A few days ago' },
];

const timeAgoTemplate = function (this: TimeAgoDemoElement) {

    return html`
    <div class="container horizontal half">
        <div class="horizontal">
            <ui-select placeholder="Select a time..." @ui-value-changed=${ (event: ValueChangeEvent<TimeOption>) => this.handleTimeChange(event) }>
                <ui-listbox data-part="overlay">
                    ${ options.map(option => html`<ui-listitem .value=${ option }>${ option.label }</ui-listitem>`) }
                </ui-listbox>
            </ui-select>
        </div>
        <div class="horizontal">
            <ui-time-ago .date=${ this.date }></ui-time-ago>
        </div>
    </div>
    `;
};

@customElement('demo-time-ago')
export class TimeAgoDemoElement extends LitElement {

    @state()
    protected date = new Date();

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return timeAgoTemplate.apply(this);
    }

    protected handleTimeChange (event: ValueChangeEvent<TimeOption>): void {

        const { value } = event.detail.current;

        const now = Date.now();

        switch (value) {

            case 0:
                this.date = new Date();
                break;

            case 1:
                this.date = new Date(now - SECONDS_PER_MINUTE * 3 * 1000);
                break;

            case 2:
                this.date = new Date(now - SECONDS_PER_HOUR * 1000);
                break;

            case 3:
                this.date = new Date(now - SECONDS_PER_HOUR * 4 * 1000);
                break;

            case 4:
                this.date = new Date(now - SECONDS_PER_DAY * 1000);
                break;

            case 5:
                this.date = new Date(now - SECONDS_PER_DAY * 2 * 1000);
                break;
        }

        console.log(this.date);
    }
}
