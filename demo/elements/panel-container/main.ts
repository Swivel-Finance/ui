import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PanelChangeEvent, PanelDirection, PanelNavigationEvent } from '../../../src/elements/panel-container/index.js';
import { dispatch } from '../../../src/utils/events/index.js';
import '../../../src/elements/panel-container/panel-container.js';
import '../../../src/elements/wizard/wizard.js';

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
