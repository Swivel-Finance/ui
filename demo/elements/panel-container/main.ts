import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ListConfig } from '../../../src/behaviors/list/config.js';
import { PanelChangeEvent, PanelDirection, PanelNavigationEvent } from '../../../src/elements/panel-container/index.js';
import { dispatch } from '../../../src/utils/events/index.js';
import '../../../src/elements/panel-container/panel-container.js';
import '../../../src/elements/tabs/tabs.js';
import '../../../src/elements/wizard/wizard.js';

// WIZARD

const wizardTemplate = function (this: WizardDemoElement) {

    const back = (event: MouseEvent) => {

        const target = event.target as HTMLElement;

        dispatch(target, new PanelNavigationEvent({ target, panel: PanelDirection.PREVIOUS }));
    };

    const close = (event: MouseEvent) => {

        const target = event.target as HTMLElement;

        dispatch(target, new PanelNavigationEvent({ target, panel: PanelDirection.FIRST }));
    };

    return html`
    <ui-wizard .current=${ this.step } @ui-panel-changed=${ (event: PanelChangeEvent) => this.handleStepChange(event) }>

        <nav class="step-navigation" aria-label="Transaction Steps">
            <ul class="step-list" data-part="triggers">
                <li class="step-link"><a data-part="trigger" href="#">Select a Position</a></li>
                <li class="step-link"><a data-part="trigger" href="#" aria-disabled=${ this.step < STEPS.PREVIEW }>Transaction Preview</a></li>
                <li class="step-link"><a data-part="trigger" href="#" aria-disabled=${ this.step < STEPS.RESULT }>Transaction Result</a></li>
            </ul>
        </nav>

        <div class="step-container" data-part="panels">

            <div class="step-panel" data-part="panel">
                <div class="widget">
                    <h3>Select a position</h3>
                    <div class="controls">
                        <button @click=${ () => this.handlePosition() }>Position A</button>
                        <button @click=${ () => this.handlePosition() }>Position B</button>
                        <button @click=${ () => this.handlePosition() }>Position C</button>
                    </div>
                </div>
            </div>

            <div class="step-panel" data-part="panel">
                <div class="widget">
                    <h3>Transaction Preview</h3>
                    <div class="controls">
                        <button @click=${ () => this.handleConfirm() }>Confirm</button>
                        <button class="ghost" @click=${ (event: MouseEvent) => back(event) }>Back</button>
                    </div>
                </div>
            </div>

            <div class="step-panel" data-part="panel">
                <div class="widget">
                    <h3>Transaction Result</h3>
                    <div class="controls">
                        <span>Success!</span>
                        <button class="ghost" @click=${ (event: MouseEvent) => close(event) }>Close</button>
                    </div>
                </div>
            </div>

        </div>

    </ui-wizard>
    `;
};

const enum STEPS {
    POSITION,
    PREVIEW,
    RESULT,
}

@customElement('demo-wizard')
export class WizardDemoElement extends LitElement {

    @state()
    protected step = STEPS.POSITION;

    protected render (): unknown {

        return wizardTemplate.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected handlePosition (): void {

        this.step = STEPS.PREVIEW;
    }

    protected handleConfirm (): void {

        this.step = STEPS.RESULT;
    }

    protected handleStepChange (event: PanelChangeEvent): void {

        const step = event.detail.panel;

        if (step === this.step) return;

        this.step = step;

        switch (step) {

            case STEPS.POSITION:

                // do sth in response to the step change
                break;

            case STEPS.PREVIEW:

                // do sth in response to the step change
                break;

            case STEPS.RESULT:

                // do sth in response to the step change
                break;
        }
    }
}

// TABS

const tabsTemplate = function (this: TabsDemoElement) {

    return html`
    <div class="container horizontal" style="margin-bottom: calc(var(--line-height) * 2);">
        <div>
            <label><code>orientation</code>:</label>
        </div>
        <div style="display: flex; gap: var(--grid-size-l);">
            <label style="display: flex; align-items: center; gap: var(--grid-size);">
                <code>horizontal</code>
                <input type="radio" name="orientation" value="horizontal" .checked=${ this.orientation === 'horizontal' } @change=${ (event: Event) => this.handleOrientation(event) }>
            </label>
            <label style="display: flex; align-items: center; gap: var(--grid-size);">
                <code>vertical</code>
                <input type="radio" name="orientation" value="vertical" .checked=${ this.orientation === 'vertical' } @change=${ (event: Event) => this.handleOrientation(event) }>
            </label>
        </div>
    </div>

    <ui-tabs .orientation=${ this.orientation }>

        <div class="tab-list" data-part="triggers">
            <button class="tab" data-part="trigger">Tab One</button>
            <button class="tab" data-part="trigger">Tab Two</button>
            <button class="tab" data-part="trigger" disabled>Tab Three</button>
            <button class="tab" data-part="trigger">Tab Four</button>
        </div>

        <div class="tab-container" data-part="panels">

            <div class="tab-panel" data-part="panel">
                <h3>Tab One</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa exercitationem facere fugiat molestiae,
                    unde inventore temporibus modi minus necessitatibus officiis dolores amet ipsum tempore obcaecati
                    est sapiente magni accusamus saepe?</p>
            </div>

            <div class="tab-panel" data-part="panel">
                <h3>Tab Two</h3>
                <p>Cum hic et nemo atque veritatis amet rerum qui id possimus laboriosam nesciunt aperiam quam in magnam
                    illum molestiae dignissimos, iusto, explicabo eius velit assumenda mollitia quia perferendis quo!
                    Eveniet.</p>
            </div>

            <div class="tab-panel" data-part="panel">
                <h3>Tab Three</h3>
                <p>Magnam modi excepturi repellat dolores architecto, impedit dolorum, mollitia aliquid culpa ipsa
                    incidunt, sint eos magni doloribus saepe reiciendis sunt enim cum officiis dolor vero quis?
                    Excepturi vel optio pariatur?</p>
            </div>

            <div class="tab-panel" data-part="panel">
                <h3>Tab Four</h3>
                <p>Impedit commodi corporis minima, rerum ratione ipsam in cum aperiam officiis itaque ducimus ad
                    consequatur, quia, vel quae ipsum consectetur quis recusandae soluta necessitatibus inventore
                    dignissimos fugit. Incidunt, impedit aut!</p>
            </div>

        </div>

    </ui-tabs>
    `;
};

@customElement('demo-tabs')
export class TabsDemoElement extends LitElement {

    @state()
    protected orientation: ListConfig['orientation'] = 'horizontal';

    protected render (): unknown {

        return tabsTemplate.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected handleOrientation (event: Event): void {

        this.orientation = (event.target as HTMLInputElement).value as ListConfig['orientation'];
    }

    protected handleTabChange (event: PanelChangeEvent): void {

        const tab = event.detail.panel;

        switch (tab) {

            case 0:

                // do sth in response to the tab change
                break;

            case 1:

                // do sth in response to the tab change
                break;
        }
    }
}
