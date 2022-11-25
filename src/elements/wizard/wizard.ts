import { customElement } from 'lit/decorators.js';
import { IDGenerator } from '../../utils/dom';
import { PanelContainerElement } from '../panel-container';

const TRIGGER_ID_GENERATOR = new IDGenerator('ui-wizard-trigger-');
const PANEL_ID_GENERATOR = new IDGenerator('ui-wizard-panel-');

/**
 * WizardElement
 *
 * @example
 * Use this element in your tempate like this:
 *
 * ```html
 * <ui-wizard .current=${ this.step } @ui-panel-changed=${ (event: PanelChangeEvent) => this.handlePanelChange(event) }>
 *
 *   <nav aria-label="A label for this navigation">
 *     <ul>
 *       <li><a href="#" data-part="trigger">Step One</a></li>
 *       <li><a href="#" data-part="trigger">Step Two</a></li>
 *     </ul>
 *   </nav>
 *
 *   <div data-part="panels">
 *     <div data-part="panel">Step One Content</div>
 *     <div data-part="panel">Step Two Content</div>
 *   </div>
 *
 * </ui-wizard>
 * ```
 *
 * The following attributes will be added by the wizard for accessibility:
 *
 * ```html
 * <ui-wizard>
 *
 *   <nav aria-label="A label for this navigation">
 *     <ul>
 *       <li><a href="#" data-part="trigger" aria-current="step">Step One</a></li>
 *       <li><a href="#" data-part="trigger" aria-current="false">Step Two</a></li>
 *     </ul>
 *   </nav>
 *
 *   <div data-part="panels">
 *     <div data-part="panel" role="region" aria-hidden="false">Step One Content</div>
 *     <div data-part="panel" role="region" aria-hidden="true" hidden>Step Two Content</div>
 *   </div>
 *
 * </ui-wizard>
 * ```
 */
@customElement('ui-wizard')
export class WizardElement extends PanelContainerElement {

    protected triggerIdGenerator = TRIGGER_ID_GENERATOR;

    protected panelIdGenerator = PANEL_ID_GENERATOR;

    protected initialize (index: number): void {

        const panel = this.panelElements?.[index];

        panel?.setAttribute('role', 'region');

        super.initialize(index);
    }

    protected markActive (index: number): void {

        super.markActive(index);

        const trigger = this.triggerElements?.[index];

        trigger?.setAttribute('aria-current', 'step');
    }

    protected markInactive (index: number): void {

        super.markInactive(index);

        const trigger = this.triggerElements?.[index];

        trigger?.setAttribute('aria-current', 'false');
    }
}
