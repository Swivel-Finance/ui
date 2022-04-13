/* eslint-disable @typescript-eslint/no-unused-vars */
import { AttributeManager, IDGenerator, setAttribute } from '../../../utils/dom/index.js';
import { cancel, EventManager } from '../../../utils/events/index.js';
import { ENTER, ESCAPE, SPACE } from '../../../utils/index.js';
import { Behavior } from '../../behavior.js';
import { OpenChangeEvent } from '../events.js';
import type { OverlayBehavior } from '../overlay.js';
import { OverlayTriggerConfig, OVERLAY_TRIGGER_CONFIG_DEFAULT } from './config.js';

const OVERLAY_NOT_ATTACHED = () => new Error('The provided OverlayBehavior must be attached to a DOM element.');

const ID_GENERATOR = new IDGenerator('ui-overlay-trigger-');

export class OverlayTriggerBehavior extends Behavior {

    protected eventManager = new EventManager();

    protected attributeManager?: AttributeManager;

    protected clickMode: 'show' | 'hide' = 'show';

    protected config: OverlayTriggerConfig;

    // the trigger needs a reference to the overlay to infer it's state, capture events, etc.
    protected overlay?: OverlayBehavior;

    id = ID_GENERATOR.getNext();

    constructor (config?: Partial<OverlayTriggerConfig>) {

        super();

        this.config = { ...OVERLAY_TRIGGER_CONFIG_DEFAULT, ...config };
    }

    attach (element: HTMLElement, overlay: OverlayBehavior, ...args: unknown[]): boolean {

        if (!super.attach(element)) return false;

        if (!overlay.element) throw OVERLAY_NOT_ATTACHED();

        this.attributeManager = new AttributeManager(element);
        this.overlay = overlay;

        this.addAttributes();
        this.addListeners();
        this.update();

        return true;
    }

    detach (...args: unknown[]): boolean {

        if (!this.hasAttached) return false;

        this.eventManager.unlistenAll();

        void this.overlay?.hide();

        this.overlay = undefined;

        this.removeListeners();
        this.removeAttributes();

        return super.detach();
    }

    update (): void {

        if (!this.element) return;

        setAttribute(this.element, 'aria-expanded', !!this.overlay && !this.overlay.hidden);
    }

    protected addAttributes (): void {

        this.attributeManager?.set('id', this.element?.id || this.id);
        this.attributeManager?.set('aria-haspopup', this.config.role);
        this.attributeManager?.set('aria-expanded', !!this.overlay && !this.overlay.hidden);
        this.attributeManager?.set('aria-controls', this.overlay?.element?.id);
    }

    protected removeAttributes (): void {

        this.attributeManager?.restoreAll();
    }

    protected addListeners (): void {

        if (!this.element || !this.overlay?.element) return;

        this.eventManager.listen(this.element, 'mousedown', event => this.handleMouseDown(event as MouseEvent));
        this.eventManager.listen(this.element, 'click', event => this.handleClick(event as MouseEvent));
        this.eventManager.listen(this.element, 'keydown', event => this.handleKeyDown(event as KeyboardEvent));

        this.eventManager.listen(this.overlay.element, 'ui-open-changed', event => this.handleOpenChange(event as OpenChangeEvent));
    }

    protected removeListeners (): void {

        this.eventManager.unlistenAll();
    }

    /**
     * @remarks
     * `click` events are dispatched after `mouseup`, by which time focus change events will already
     * have dispatched and an overlay may close due to focus loss.
     * Using the {@link FocusMonitor} we can handle `mousedown` before `ui-focus-changed` events.
     * This means we are able to handle the `mousedown` before the overlay potentially closes due
     * to focus loss and prevent a 'close'-click from reopening the overlay.
     */
    protected handleMouseDown (event: MouseEvent): void {

        this.clickMode = (this.overlay && !this.overlay.hidden)
            ? 'hide'
            : 'show';
    }

    protected handleClick (event: MouseEvent): void {

        if (!this.overlay) return;

        (this.clickMode === 'hide')
            ? void this.overlay.hide(true)
            : void this.overlay.show(true);

        // reset the click-mode
        this.clickMode = 'show';

        this.update();
    }

    protected handleKeyDown (event: KeyboardEvent): void {

        if (!this.overlay || event.target !== this.element) return;

        switch (event.key) {

            case ENTER:
            case SPACE:

                cancel(event);
                void this.overlay.toggle(true);
                this.update();
                break;

            case ESCAPE:

                // don't handle ESCAPE if the overlay is hidden
                if (this.overlay.hidden) break;

                cancel(event);
                void this.overlay.hide(true);
                this.update();
                break;
        }
    }

    protected handleOpenChange (event: OpenChangeEvent): void {

        // only handle OpenChangeEvents which are dispatched on this trigger's overlay element
        if (event.detail.target !== this.overlay?.element) return;

        this.update();
    }
}
