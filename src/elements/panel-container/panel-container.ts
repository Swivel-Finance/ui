import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CLASS_MAP, toggleVisibility } from '../../behaviors';
import { ENTER, SPACE } from '../../utils';
import { animationtask, cancelTask, TaskReference } from '../../utils/async';
import { AnimationsDoneOptions, IDGenerator, isDisabled } from '../../utils/dom';
import { cancel, EventManager } from '../../utils/events';
import { PanelChangeEvent, PanelNavigationEvent } from './events';
import { PanelDirection } from './types';

/*
 * ID generators for the trigger and panel elements
 *
 * @remarks
 * We use a static instance for each generator and link it to the container element's prototype. This ensures
 * that with each container element instance the id's are continuously increased instead of reset for each
 * instance.
 */
const TRIGGER_ID_GENERATOR = new IDGenerator('ui-container-trigger-');
const PANEL_ID_GENERATOR = new IDGenerator('ui-container-panel-');

/*
 * CSS selectors for the trigger and panel elements
 *
 * @remarks
 * We exclude trigger and panel elements which are nested inside of other triggers or panels.
 * These don't belong to this container instance and should be ignored.
 */
const NOT_NESTED = ':not(:is(:scope [data-part=panel] *, :scope [data-part=trigger] *))';
const TRIGGER_ROOT_SELECTOR = `:scope [data-part=triggers]${ NOT_NESTED }`;
const TRIGGER_SELECTOR = `:scope [data-part=trigger]${ NOT_NESTED }`;
const PANEL_ROOT_SELECTOR = `:scope [data-part=panels]${ NOT_NESTED }`;
const PANEL_SELECTOR = `:scope [data-part=panel]${ NOT_NESTED }`;

/**
 * A base class for panel-based components, like tabs, wizards or galleries.
 */
@customElement('ui-panel-container')
export class PanelContainerElement extends LitElement {

    protected _current = 0;

    protected eventManager = new EventManager();

    protected mutationObserver = new MutationObserver(this.handleMutations.bind(this));

    protected updateTask?: TaskReference<void>;

    // triggers

    protected triggerRootSelector = TRIGGER_ROOT_SELECTOR;

    protected triggerRootElement?: HTMLElement;

    protected triggerIdGenerator = TRIGGER_ID_GENERATOR;

    protected triggerSelector = TRIGGER_SELECTOR;

    protected triggerElements?: HTMLElement[];

    // panels

    protected panelRootSelector = PANEL_ROOT_SELECTOR;

    protected panelRootElement?: HTMLElement;

    protected panelIdGenerator = PANEL_ID_GENERATOR;

    protected panelSelector = PANEL_SELECTOR;

    protected panelElements?: HTMLElement[];

    /**
     * The current active panel index
     */
    @property()
    set current (value: number) {

        void this.updateCurrent(value, true);
    }

    get current (): number {

        return this._current;
    }

    /**
     * Should panel transitions be animated
     */
    @property()
    animated = true;

    /**
     * Optional options for how to await animations
     *
     * @remarks
     * By default, we don't wait for animations which are infinite (e.g. loaders) and
     * we don't want to wait for animations in the subtree of the container panel
     * (we only want to await the panel transition itself).
     */
    @property()
    animationOptions: Partial<AnimationsDoneOptions> = { subtree: false };

    connectedCallback (): void {

        super.connectedCallback();

        this.selectElements();

        if (!this.hasUpdated) {

            this.addAttributes();
        }

        this.addListeners();
    }

    disconnectedCallback (): void {

        this.updateTask && cancelTask(this.updateTask);

        this.removeAttributes();
        this.removeListeners();

        super.disconnectedCallback();
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected selectElements (): void {

        this.triggerRootElement = this.renderRoot.querySelector(this.triggerRootSelector) ?? undefined;
        this.triggerElements = Array.from(this.renderRoot.querySelectorAll(this.triggerSelector));

        this.panelRootElement = this.renderRoot.querySelector(this.panelRootSelector) ?? undefined;
        this.panelElements = Array.from(this.renderRoot.querySelectorAll(this.panelSelector));
    }

    protected addListeners (): void {

        // use event delegation for trigger events
        this.eventManager.listen(this, 'click', event => this.handleClick(event as MouseEvent));
        this.eventManager.listen(this, 'keydown', event => this.handleKeyDown(event as KeyboardEvent));
        this.eventManager.listen(this, 'ui-panel-navigation', event => this.handleNavigation(event as PanelNavigationEvent));

        this.mutationObserver.observe(this, { attributes: false, childList: true, subtree: true });
    }

    protected removeListeners (): void {

        this.mutationObserver.disconnect();

        this.eventManager.unlistenAll();
    }

    protected addAttributes (): void {

        this.panelElements?.forEach((panel, index) => this.initialize(index));
    }

    protected removeAttributes (): void {

        // we don't remove any of the managed attributes - the component might get attached again
    }

    /**
     * Initialize the panel and/or trigger at the specified index
     */
    protected initialize (index: number): void {

        const trigger = this.triggerElements?.[index];
        const panel = this.panelElements?.[index];

        if (trigger) {

            const triggerId = trigger.getAttribute('id') || this.triggerIdGenerator.getNext();

            trigger.setAttribute('id', triggerId);
            trigger.setAttribute('data-index', index.toString());
        }

        if (panel) {

            const panelId = panel.getAttribute('id') || this.panelIdGenerator.getNext();

            panel.setAttribute('id', panelId);
            panel.setAttribute('data-index', index.toString());
        }

        // finish initialization by marking the trigger/panel as active or inactive
        (index === this.current)
            ? this.markActive(index)
            : this.markInactive(index);
    }

    /**
     * Mark the panel and/or trigger at the specified index as active
     */
    protected markActive (index: number): void {

        const panel = this.panelElements?.[index];

        panel?.classList.remove(CLASS_MAP.invisible);
        panel?.classList.add(CLASS_MAP.visible);
        panel?.removeAttribute('hidden');
        panel?.setAttribute('aria-hidden', 'false');
    }

    /**
     * Mark the panel and/or trigger at the specified index as inactive
     */
    protected markInactive (index: number): void {

        const panel = this.panelElements?.[index];

        panel?.classList.remove(CLASS_MAP.visible);
        panel?.classList.add(CLASS_MAP.invisible);
        panel?.setAttribute('hidden', '');
        panel?.setAttribute('aria-hidden', 'true');
    }

    /**
     * Handle click events from the trigger elements
     */
    protected handleClick (event: MouseEvent): void {

        const element = event.target as HTMLElement;

        // ignore the event if it didn't happen on one of our triggers
        if (!this.triggerElements?.includes(element)) return;

        // cancel the event if we handle it
        cancel(event);

        const index = parseInt(element.getAttribute('data-index') || '0');

        if (!this.isDisabled(index)) void this.updateCurrent(index);
    }

    /**
     * Handle keydown events from the trigger elements
     */
    protected handleKeyDown (event: KeyboardEvent): void {

        const element = event.target as HTMLElement;

        // ignore the event if it didn't happen on one of our triggers
        if (!this.triggerElements?.includes(element)) return;

        const index = parseInt(element.getAttribute('data-index') || '0');

        switch (event.key) {

            case ENTER:
            case SPACE:

                // cancel the event if we handle it
                cancel(event);

                if (!this.isDisabled(index)) void this.updateCurrent(index);
                break;
        }
    }

    /**
     * Handle {@link PanelNavigationEvent}s fired from inside the container
     *
     * @remarks
     * In order to affect panel transitions without clicking on one of the trigger elements
     * we can dispatch {@link PanelNavigationEvent}s from arbitrary elements within the
     * container element.
     */
    protected handleNavigation (event: PanelNavigationEvent): void {

        // navigation events should only be handled by the container in which they are dispatched
        // immediately cancel the event to prevent it from bubbling up to parent containers
        cancel(event);

        if (!this.panelElements || this.panelElements.length === 0) return;

        const first = 0;
        const last = this.panelElements.length - 1;

        switch (event.detail.panel) {

            case PanelDirection.FIRST:

                void this.updateCurrent(this.isDisabled(first) ? this.next(first) : first);
                break;

            case PanelDirection.LAST:

                void this.updateCurrent(this.isDisabled(last) ? this.previous(last) : last);
                break;

            case PanelDirection.NEXT:

                void this.updateCurrent(this.next(this.current));
                break;

            case PanelDirection.PREVIOUS:

                void this.updateCurrent(this.previous(this.current));
                break;

            default:

                void this.updateCurrent(event.detail.panel);
                break;
        }
    }

    /**
     * Handle DOM mutations
     *
     * @remarks
     * We only observe `panel` or `trigger` elements being added or removed.
     */
    protected handleMutations (mutations: MutationRecord[]): void {

        const update = mutations.some(record => {

            const added = Array.from(record.addedNodes);
            const removed = Array.from(record.removedNodes);

            return added.some(node => this.isTrigger(node) || this.isPanel(node))
                || removed.some(node => this.isTrigger(node) || this.isPanel(node));
        });

        if (update && !this.updateTask) {

            // batch mutation callbacks into an animation frame callback
            this.updateTask = animationtask(() => {

                this.updateTask = undefined;

                this.selectElements();
                this.addAttributes();
            });
        }
    }

    /**
     * Update the currently active panel
     *
     * @remarks
     * Updates the visibility state of the affected panels, waits for animations (if enabled),
     * marks the affected panels and triggers as active/inactive and dispatches a change event
     * if not set to silent.
     */
    protected async updateCurrent (current: number, silent = false): Promise<void> {

        if (current === this.current) return;

        const previous = this.current;

        this._current = current;

        const direction = (current > previous) ? CLASS_MAP.forward : CLASS_MAP.backward;

        const previousTrigger = this.triggerElements?.[previous];
        const previousPanel = this.panelElements?.[previous];
        const currentTrigger = this.triggerElements?.[current];
        const currentPanel = this.panelElements?.[current];

        const elements = [previousTrigger, previousPanel, currentTrigger, currentPanel];

        if (!previousPanel || !currentPanel) return;

        elements.forEach(element => element?.classList.add(direction));

        await Promise.all([
            toggleVisibility(previousPanel, false, previousTrigger, this.animated, undefined, this.animationOptions),
            toggleVisibility(currentPanel, true, currentTrigger, this.animated, undefined, this.animationOptions),
        ]);

        elements.forEach(element => element?.classList.remove(direction));

        this.markInactive(previous);
        this.markActive(current);

        this.requestUpdate('current', previous);

        await this.updateComplete;

        if (!silent) this.dispatchChange(current);
    }

    protected dispatchChange (panel: number): void {

        this.dispatchEvent(new PanelChangeEvent({
            target: this,
            panel,
        }));
    }

    /**
     * Get the next non-disabled panel index relative to the current panel index
     */
    protected next (current: number): number {

        const last = (this.panelElements?.length || 1) - 1;

        let next = current === last ? current : current + 1;

        while (next < last && this.isDisabled(next)) {

            next++;
        }

        return this.isDisabled(next) ? current : next;
    }

    /**
     * Get the previous non-disabled panel index relative to the current panel index
     */
    protected previous (current: number): number {

        const first = 0;

        let next = current === first ? current : current - 1;

        while (next > first && this.isDisabled(next)) {

            next--;
        }

        return this.isDisabled(next) ? current : next;
    }

    /**
     * Checks if the panel at the specified index is disabled
     */
    protected isDisabled (index: number): boolean {

        const panel = this.panelElements?.[index];
        const trigger = this.triggerElements?.[index];

        return !panel
            || isDisabled(panel)
            || !!trigger && isDisabled(trigger);
    }

    /**
     * Checks if an element is a valid trigger of this container
     */
    protected isTrigger (element: Node): boolean {

        const part = (element as Element).getAttribute?.('data-part');

        return part === 'trigger' && !this.isNested(element);
    }

    /**
     * Checks if an element is a valid panel of this container
     */
    protected isPanel (element: Node): boolean {

        const part = (element as Element).getAttribute?.('data-part');

        return part === 'panel' && !this.isNested(element);
    }

    /**
     * Checks if an element is nested inside of one of the container's triggers or panels
     */
    protected isNested (element: Node): boolean {

        const inTriggers = !!this.triggerElements?.some(trigger => trigger.contains(element) && trigger !== element);
        const inPanels = !!this.panelElements?.some(panel => panel.contains(element) && panel !== element);

        return inTriggers || inPanels;
    }
}
