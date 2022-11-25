import { PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FocusListBehavior, ListConfig, LIST_CONFIG_TABS, SelectEvent } from '../../behaviors/list';
import { IDGenerator } from '../../utils/dom';
import { cancel } from '../../utils/events';
import { PanelContainerElement } from '../panel-container';

const TRIGGER_ID_GENERATOR = new IDGenerator('ui-tabs-trigger-');
const PANEL_ID_GENERATOR = new IDGenerator('ui-tabs-panel-');

/**
 * TabsElement
 *
 * @example
 * Use this element in your tempate like this:
 *
 * ```html
 * <ui-tabs>
 *
 *   <div data-part="triggers">
 *     <button data-part="trigger"></button>
 *     <button data-part="trigger"></button>
 *   </div>
 *
 *   <div data-part="panels">
 *     <div data-part="panel"></div>
 *     <div data-part="panel"></div>
 *   </div>
 *
 * </ui-tabs>
 * ```
 *
 * The following attributes will be added by the tabs for accessibility:
 *
 * ```html
 * <ui-tabs>
 *
 *   <div data-part="triggers" role="tablist">
 *     <button data-part="trigger" id="tab-0" role="tab" aria-selected="true" aria-controls="tab-panel-0" tabindex="0"></button>
 *     <button data-part="trigger" id="tab-1" role="tab" aria-selected="false" aria-controls="tab-panel-1" tabindex="-1"></button>
 *   </div>
 *
 *   <div data-part="panels">
 *     <div data-part="panel" id="tab-panel-0" role="tabpanel" aria-labelledby="tab-0" tabindex="0"></div>
 *     <div data-part="panel" id="tab-panel-1" role="tabpanel" aria-labelledby="tab-1" tabindex="0"></div>
 *   </div>
 *
 * </ui-tabs>
 * ```
 */
@customElement('ui-tabs')
export class TabsElement extends PanelContainerElement {

    protected triggerIdGenerator = TRIGGER_ID_GENERATOR;

    protected panelIdGenerator = PANEL_ID_GENERATOR;

    protected listBehavior?: FocusListBehavior;

    @property()
    orientation: ListConfig['orientation'] = 'horizontal';

    disconnectedCallback (): void {

        this.detachBehaviors();

        super.disconnectedCallback();
    }

    protected updated (changes: PropertyValues<TabsElement>): void {

        if (changes.has('orientation')) {

            this.attachBehaviors();
        }
    }

    protected selectElements (): void {

        super.selectElements();

        this.attachBehaviors();
    }

    protected addAttributes (): void {

        super.addAttributes();

        this.triggerRootElement?.setAttribute('role', 'tablist');
    }

    protected addListeners (): void {

        super.addListeners();

        this.eventManager.listen(this, 'ui-select-item', event => this.handleSelection(event as SelectEvent));
    }

    protected attachBehaviors (): void {

        this.detachBehaviors();

        if (!this.triggerRootElement) return;

        this.listBehavior = new FocusListBehavior({
            ...LIST_CONFIG_TABS,
            orientation: this.orientation ?? 'horizontal',
        });

        this.listBehavior.attach(this.triggerRootElement, this.triggerElements ?? []);
    }

    protected detachBehaviors (): void {

        this.listBehavior?.detach();
    }

    protected initialize (index: number): void {

        super.initialize(index);

        const trigger = this.triggerElements?.[index];
        const panel = this.panelElements?.[index];

        trigger?.setAttribute('role', 'tab');
        trigger?.setAttribute('aria-controls', panel?.id ?? '');

        panel?.setAttribute('role', 'tabpanel');
        panel?.setAttribute('aria-labelledby', trigger?.id ?? '');
    }

    protected markActive (index: number): void {

        super.markActive(index);

        const trigger = this.triggerElements?.[index];
        const panel = this.panelElements?.[index];

        trigger?.setAttribute('aria-selected', 'true');
        trigger?.setAttribute('tabindex', '0');

        panel?.removeAttribute('tabindex');
    }

    protected markInactive (index: number): void {

        super.markInactive(index);

        const trigger = this.triggerElements?.[index];
        const panel = this.panelElements?.[index];

        trigger?.setAttribute('aria-selected', 'false');
        trigger?.setAttribute('tabindex', '-1');

        panel?.setAttribute('tabindex', '0');
    }

    protected handleSelection (event: SelectEvent): void {

        if (event.detail.target !== this.triggerRootElement) return;

        cancel(event);

        if (!event.detail.change) return;

        const index = event.detail.current?.index ?? 0;

        if (!this.isDisabled(index)) void this.updateCurrent(index);
    }
}
