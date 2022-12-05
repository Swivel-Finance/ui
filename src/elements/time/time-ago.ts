import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cancelTask, delay, TaskReference } from '../../utils/async/index.js';
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, TimeAgoFormatter } from '../../utils/date/index.js';

const template = function (this: TimeAgoElement): unknown {

    const formats = this.date
        ? this.formatter.format(this.date)
        : undefined;

    return this.date
        ? html`${ formats?.format }`
        : nothing;
};

@customElement('ui-time-ago')
export class TimeAgoElement extends LitElement {

    protected formatter = new TimeAgoFormatter();

    protected nextRefresh?: TaskReference;

    @property({ attribute: false })
    date?: Date | number | string;

    connectedCallback (): void {

        super.connectedCallback();

        if (this.hasUpdated) {

            this.scheduleRefresh();
        }
    }

    disconnectedCallback (): void {

        this.nextRefresh && cancelTask(this.nextRefresh);
        this.nextRefresh = undefined;

        super.disconnectedCallback();
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return template.apply(this);
    }

    protected updated (): void {

        this.scheduleRefresh();
    }

    protected scheduleRefresh (): void {

        if (!this.date) return;

        if (this.nextRefresh) cancelTask(this.nextRefresh);

        const { days, hours, minutes, seconds } = this.formatter.parts(this.date);

        const next = days > 0
            // update on the next day
            ? SECONDS_PER_DAY - (seconds % SECONDS_PER_DAY)
            : hours > 0
                // update on the next hour
                ? SECONDS_PER_HOUR - (seconds % SECONDS_PER_HOUR)
                : minutes > 0
                    // update on the next minute
                    ? SECONDS_PER_MINUTE - (seconds % SECONDS_PER_MINUTE)
                    // update on every 5 seconds
                    : 5 - (seconds % 5);

        this.nextRefresh = delay(() => {

            this.requestUpdate();

            this.nextRefresh = undefined;

        }, next * 1000);
    }
}
