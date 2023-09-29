/* eslint-disable @typescript-eslint/no-unused-vars */
import { microtask } from '../../utils/async/index.js';
import { activeElement, AttributeManager, IDGenerator } from '../../utils/dom/index.js';
import { cancel, EventManager } from '../../utils/events/index.js';
import { ESCAPE } from '../../utils/index.js';
import { Behavior } from '../behavior.js';
import { FocusChangeEvent } from '../focus/index.js';
import { MarkerElement, MarkerRemovedEvent } from '../marker/index.js';
import { Origin, Size } from '../position/index.js';
import { toggleVisibility } from '../utils/index.js';
import { OverlayBackdrop } from './backdrop/index.js';
import { OverlayConfig, OVERLAY_CONFIG_DEFAULT } from './config.js';
import { OpenChangeEvent } from './events.js';
import { OverlayStack } from './stack/index.js';
import type { OverlayTriggerBehavior } from './trigger/index.js';

const ID_GENERATOR = new IDGenerator('ui-overlay-');

export class OverlayBehavior extends Behavior {

    /**
     * The backdrop implementation of the OverlayBehavior.
     *
     * @remarks
     * This allows the backdrop to be configured/exchanged for all overlays *before* any
     * OverlayBehavior is created. E.g. in your entry script:
     * ```typescript
     * OverlayBehavior.backdrop = new OverlayBackdrop({ animated: false });
     * ```
     */
    static backdrop = new OverlayBackdrop();

    /**
     * The stack implementation of the OverlayBehavior.
     *
     * @remarks
     * This allows the stack to be configured/exchanged for all overlays *before* any
     * OverlayBehavior is created. E.g. in your entry script:
     * ```typescript
     * OverlayBehavior.stack = new MyCustomStack();
     * ```
     */
    static stack = new OverlayStack();

    protected _config!: OverlayConfig;

    protected _hidden = true;

    protected _moving = false;

    protected eventManager = new EventManager();

    protected attributeManager?: AttributeManager;

    protected root = document.body;

    protected marker = new MarkerElement();

    id = ID_GENERATOR.getNext();

    get static (): typeof OverlayBehavior {

        return this.constructor as typeof OverlayBehavior;
    }

    get config (): OverlayConfig {

        return this._config;
    }

    set config (value: Partial<OverlayConfig>) {

        const attached = this.hasAttached;
        const element = this.element;
        const hidden = this.hidden;

        if (attached) this.detach();

        this._config = { ...(this._config ?? OVERLAY_CONFIG_DEFAULT), ...value };

        if (attached && element) this.attach(element);
        if (!hidden) void this.show();
    }

    get hidden (): boolean {

        return this._hidden;
    }

    get moving (): boolean {

        return this._moving;
    }

    get focused (): boolean {

        return !this.hidden && this.config.focusBehavior
            ? this.config.focusBehavior.focused
            : !!this.element?.contains(activeElement());
    }

    /**
     * An overlay is considered active if either itself has focus or a descendant overlay has focus.
     */
    get active (): boolean {

        return !this.hidden && this.config.stacked
            ? this.static.stack.active(this)
            : this.focused;
    }

    get parent (): OverlayBehavior | undefined {

        return this.static.stack.parent(this);
    }

    get trigger (): OverlayTriggerBehavior | undefined {

        return this.config.triggerBehavior;
    }

    constructor (config: Partial<OverlayConfig> = {}) {

        super();

        this.config = config;
    }

    attach (element: HTMLElement, ...args: unknown[]): boolean {

        if (!super.attach(element)) return false;

        this.attributeManager = new AttributeManager(element);

        this.addAttributes();
        this.addListeners();

        this.element?.classList.add(this.config.classes.overlay, this.config.classes.invisible);

        return true;
    }

    detach (...args: unknown[]): boolean {

        if (!this.hasAttached) return false;

        void this.hide(false, true);

        this.removeListeners();
        this.removeAttributes();

        this.element?.classList.remove(...Object.values(this.config.classes));

        return super.detach();
    }

    async show (interactive = false): Promise<void> {

        if (!this.hidden || !this.element) return;

        this._hidden = false;

        // cache the element instance, the behavior might be detached during showing
        const element = this.element;

        this.updateStack();

        this.moveToRoot();

        this.showBackdrop();

        this.config.positionBehavior?.attach(element);

        const isVisible = toggleVisibility(element, true, this.trigger?.element, this.config.animated, this.config.classes, this.config.animationOptions);

        await isVisible;

        // if overlay was hidden in the meantime, finish here
        if (this.hidden) return;

        this.config.focusBehavior?.attach(element);

        this.dispatch(new OpenChangeEvent({
            open: true,
            target: element,
        }));
    }

    async hide (interactive = false, detaching = false): Promise<void> {

        // don't return early when detaching - a focus loss could have triggered an animated hide
        // which we want to 'speed up' by hiding the overlay synchronously
        if (!detaching && (this.hidden || !this.element)) return;

        this._hidden = true;

        // cache the element instance, the behavior might be detached during hiding
        const element = this.element;

        this.updateStack(detaching);

        this.hideBackdrop();

        this.config.focusBehavior?.detach();

        const isVisible = element
            ? toggleVisibility(element, false, this.trigger?.element, this.config.animated && !detaching, this.config.classes, this.config.animationOptions)
            : Promise.resolve();

        // skip awaiting animations when detaching - in this case we hide the overlay synchronously
        if (this.config.animated && !detaching) {

            await isVisible;

            // if overlay was shown in the meantime, finish here
            if (!this.hidden) return;
        }

        this.config.positionBehavior?.detach();

        this.moveFromRoot();

        this.dispatch(new OpenChangeEvent({
            open: false,
            target: element as HTMLElement,
        }));
    }

    async toggle (interactive = false): Promise<void> {

        this.hidden
            ? await this.show(interactive)
            : await this.hide(interactive);
    }

    async update (origin?: Origin, size?: Size): Promise<void> {

        if (this.hidden || !this.element) return;

        await this.config.positionBehavior?.requestUpdate(origin, size);
    }

    protected addAttributes (): void {

        if (!this.element) return;

        const id = this.element.id || this.id;
        const role = this.element.getAttribute('role') || this.config.role;

        this.attributeManager?.set('id', id);
        this.attributeManager?.set('role', role);
        this.attributeManager?.set('hidden', this.hidden);

        if (role === 'dialog' || role === 'alertdialog' || role === 'window') {

            // only set `aria-modal` on supported roles
            this.attributeManager?.set('aria-modal', this.config.modal);
        }
    }

    protected removeAttributes (): void {

        if (!this.element) return;

        this.attributeManager?.restoreAll();
    }

    protected addListeners (): void {

        if (!this.element) return;

        this.eventManager.listen(this.element, 'keydown', event => this.handleKeyDown(event as KeyboardEvent));
        this.eventManager.listen(this.element, 'ui-focus-changed', event => this.handleFocusChange(event as FocusChangeEvent));
        this.eventManager.listen(this.marker, 'ui-marker-removed', event => this.handleMarkerRemoved(event as MarkerRemovedEvent));
    }

    protected removeListeners (): void {

        this.eventManager.unlistenAll();
    }

    protected updateStack (detaching = false): void {

        if (!this.config.stacked) return;

        this.static.stack.update(this, !this.hidden, detaching);
    }

    protected showBackdrop (): void {

        if (!this.config.backdrop || !this.element) return;

        void this.static.backdrop.show(this.element);
    }

    protected hideBackdrop (): void {

        if (!this.config.backdrop || !this.element) return;

        void this.static.backdrop.hide(this.element);
    }

    protected moveToRoot (): void {

        if (!this.element || this.element.parentNode === this.root) return;

        this._moving = true;

        this.element?.replaceWith(this.marker);

        this.root.append(this.element);

        this._moving = false;
    }

    protected moveFromRoot (): void {

        if (!this.element || this.element.parentNode !== this.root) return;

        this._moving = true;

        this.marker.replaceWith(this.element);

        this._moving = false;
    }

    protected handleKeyDown (event: KeyboardEvent): void {

        switch (event.key) {

            case ESCAPE:

                if (this.config.closeOnEscape) {

                    cancel(event);
                    void this.hide(true);
                }
                break;
        }
    }

    protected handleFocusChange (event: FocusChangeEvent): void {

        // only handle FocusChangeEvents which are dispatched on this overlay's element
        if (event.target !== this.element) return;

        // only handle focus loss
        if (event.detail.hasFocus) return;

        // if the overlay is stacked, ignore focus loss to a descendant overlay
        if (this.active) return;

        // get the parent overlay (before this overlay is removed from the stack)
        const parent = this.static.stack.parent(this);

        if (this.config.closeOnFocusLoss) {

            void this.hide();
        }

        // if we have a parent overlay, we dispatch the focus loss event on the parent
        // to let it know about the descendant overlay's focus loss
        if (parent) microtask(() => parent.dispatch(event));
    }

    /**
     * Handle the marker being removed
     *
     * @remarks
     * If the marker element is being removed while the overlay is open (it's not been
     * set to hidden or the marker isn't being moved by the overlay behavior) we have
     * to assume, that some parent component was removed while the overlay was still
     * open. In that case, we want to close and detach the overlay behavior and remove
     * the overlay behavior's element from the DOM.
     */
    protected handleMarkerRemoved (event: MarkerRemovedEvent): void {

        if (this.moving || this.hidden) return;

        const element = this.element;

        this.detach();

        element?.remove();
    }
}
