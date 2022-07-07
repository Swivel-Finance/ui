import { LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CLASS_MAP, toggleVisibility } from '../../behaviors/index.js';
import { OpenChangeEvent } from '../../behaviors/overlay/events.js';
import { animationtask, TaskReference } from '../../utils/async/index.js';
import { IDGenerator } from '../../utils/dom/index.js';
import { cancel, EventManager, MappedAddEventListener, MappedRemoveEventListener } from '../../utils/events/index.js';
import { ENTER, SPACE } from '../../utils/keys.js';
import { CollapsibleElementEventMap } from './events.js';

const TRIGGER_ID_GENERATOR = new IDGenerator('ui-collapsible-trigger-');
const REGION_ID_GENERATOR = new IDGenerator('ui-collapsible-region-');

@customElement('ui-collapsible')
export class CollapsibleElement extends LitElement {

    protected _expanded = false;

    protected eventManager = new EventManager();

    protected mutationObserver = new MutationObserver(this.handleMutations.bind(this));

    protected updateTask?: TaskReference<void>;

    protected regionElement?: HTMLElement;

    protected triggerElement?: HTMLElement;

    @property({
        type: Boolean,
    })
    animated = true;

    @property({
        type: Boolean,
    })
    set expanded (value: boolean) {

        // we want that setting the `expanded` property behaves just like calling
        // the `toggle` method (minus the returned promise) so we delegate updating
        // the state and UI to the `toggle` method if the custom element is connected
        if (this.isConnected) {

            void this.toggle(value);

        } else {

            const prev = this._expanded;

            this._expanded = value;

            this.requestUpdate('expanded', prev);
        }
    }

    get expanded (): boolean {

        return this._expanded;
    }

    connectedCallback (): void {

        super.connectedCallback();

        this.regionElement = this.renderRoot.querySelector('[data-part=region]') || undefined;
        this.triggerElement = this.renderRoot.querySelector('[data-part=trigger]') || undefined;

        if (!this.hasUpdated) {

            this.addAttributes();
        }

        this.addListeners();
    }

    disconnectedCallback (): void {

        this.removeAttributes();
        this.removeListeners();

        super.disconnectedCallback();
    }

    async toggle (expanded?: boolean): Promise<void> {

        // ignore the call if the internal state is already the desired state
        if (this._expanded === expanded) return;

        this._expanded = !this._expanded;

        this.requestUpdate('expanded', !this._expanded);

        void this.dispatchChange();

        await this.updateVisibility();
    }

    protected updated (_changedProperties: PropertyValues<this>): void {

        if (_changedProperties.has('expanded')) {

            this.triggerElement?.setAttribute('aria-expanded', String(this.expanded));
        }
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected addListeners (): void {

        if (!this.triggerElement || !this.regionElement) return;

        this.eventManager.listen(this.triggerElement, 'click', event => this.handleClick(event as MouseEvent));
        this.eventManager.listen(this.triggerElement, 'keydown', event => this.handleKeyDown(event as KeyboardEvent));

        this.mutationObserver.observe(this.regionElement, { attributes: false, characterData: true, childList: true, subtree: true });
    }

    protected removeListeners (): void {

        this.mutationObserver.disconnect();

        this.eventManager.unlistenAll();
    }

    protected addAttributes (): void {

        const regionId = this.triggerElement?.getAttribute('id') || REGION_ID_GENERATOR.getNext();
        const triggerId = this.triggerElement?.getAttribute('id') || TRIGGER_ID_GENERATOR.getNext();

        this.triggerElement?.setAttribute('id', triggerId);
        this.triggerElement?.setAttribute('role', 'button');
        this.triggerElement?.setAttribute('tabindex', '0');
        this.triggerElement?.setAttribute('aria-controls', regionId);
        this.triggerElement?.setAttribute('aria-expanded', String(this.expanded));

        this.regionElement?.setAttribute('id', regionId);
        this.regionElement?.setAttribute('role', 'region');
        this.regionElement?.setAttribute('aria-labelledby', triggerId);

        if (this.regionElement) {

            this.updateHeight();

            this.regionElement.hidden = !this.expanded;
            this.regionElement.classList.add(this.expanded ? CLASS_MAP.visible : CLASS_MAP.invisible);
        }
    }

    protected removeAttributes (): void {

        // we don't remove any of the managed attributes - the component might get attached again
    }

    /**
     * Performs the visual transition between expanded and collapsed state.
     */
    protected async updateVisibility (): Promise<void> {

        if (!this.triggerElement || !this.regionElement) return;

        await toggleVisibility(this.regionElement, this.expanded, this.triggerElement, this.animated);
    }

    /**
     * Recalculates the required height of the region element.
     *
     * @remarks
     * We calculate the height that the collapsible region would occupy by default
     * and set the result as a css custom property on the element. We can use the
     * css custom property in our styles to animate between collapsed and expanded
     * state.
     *
     * We have to take care of the region being hidden - in which case the
     * `scrollHeight` will return 0. In addition, we animate the region's padding
     * for the `ui-invisible` class. We need to take this into account when
     * recalculating a region's height in the collapsed state.
     */
    protected updateHeight (): void {

        if (!this.regionElement) return;

        // backup the hidden attribute
        const hidden = this.regionElement.hidden;
        // backup the visibility class
        const visibility = this.regionElement.classList.contains(CLASS_MAP.invisible) && CLASS_MAP.invisible;

        if (hidden) {

            // setup the region for measuring
            // add the check layout class to ensure the region stays visually hidden
            this.regionElement.classList.add(CLASS_MAP.checkLayout);
            // remove the visibility class to correct the paddings
            if (visibility) this.regionElement.classList.remove(visibility);
            // remove the hidden attribute to ensure we can calculate a height
            this.regionElement.hidden = false;
        }

        const height = this.regionElement.scrollHeight;

        if (hidden) {

            // restore the hidden attribute
            this.regionElement.hidden = true;
            // restore the visibility class
            if (visibility) this.regionElement.classList.add(visibility);
            // remove the check layout class
            this.regionElement.classList.remove(CLASS_MAP.checkLayout);
        }

        this.setAttribute('style', `--height:${ height }px;`);
    }

    protected handleClick (event: MouseEvent): void {

        cancel(event);

        void this.toggle();
    }

    protected handleKeyDown (event: KeyboardEvent): void {

        switch (event.key) {

            case ENTER:
            case SPACE:

                cancel(event);

                void this.toggle();
                break;
        }
    }

    /**
     * Handle DOM mutations
     *
     * @remarks
     * We observe changes to the region element and its children and recalculate the
     * required height of the region element. We skip attribute changes, to skip
     * calculations when animation classes or the `hidden` attribute are set on the
     * region element during animation.
     */
    protected handleMutations (): void {

        if (!this.updateTask) {

            // batch mutation callbacks into an animation frame callback
            this.updateTask = animationtask(() => {

                this.updateTask = undefined;

                this.updateHeight();
            });
        }
    }

    protected async dispatchChange (): Promise<void> {

        await this.updateComplete;

        this.dispatchEvent(new OpenChangeEvent({
            open: this.expanded,
            target: this,
        }));
    }
}

export interface CollapsibleElement {
    addEventListener: MappedAddEventListener<CollapsibleElement, CollapsibleElementEventMap>;
    removeEventListener: MappedRemoveEventListener<CollapsibleElement, CollapsibleElementEventMap>;
}
