import { cancelTask, delay, TaskReference } from '../../../utils/async/index.js';
import { cancel } from '../../../utils/events/index.js';
import { ESCAPE } from '../../../utils/index.js';
import { OverlayTriggerConfig } from './config.js';
import { OverlayTriggerBehavior } from './overlay-trigger.js';

export const OVERLAY_TRIGGER_CONFIG_TOOLTIP: OverlayTriggerConfig = {
    role: 'tooltip',
    delay: 500,
};

export class TooltipTriggerBehavior extends OverlayTriggerBehavior {

    /**
     * We use a helper state to deal with async timing of showing/hiding
     */
    protected active = false;

    /**
     * We keep track of the tooltip overlay's hover state
     */
    protected overlayHovered = false;

    /**
     * We use a task to show and hide the tooltip with a delay
     */
    protected updateTask?: TaskReference;

    constructor (config?: Partial<OverlayTriggerConfig>) {

        super();

        this.config = { ...OVERLAY_TRIGGER_CONFIG_TOOLTIP, ...config };
    }

    detach (...args: unknown[]): boolean {

        // ensure to cancel any scheduled updateTask when detaching
        this.updateTask && cancelTask(this.updateTask);

        this.updateTask = undefined;

        this.active = false;

        return super.detach(...args);
    }

    update (): void {

        // don't set `aria-expanded` attribute on the tooltip trigger
    }

    protected show (): void {

        this.active = true;

        this.updateTask && cancelTask(this.updateTask);

        this.updateTask = delay(() => {

            if (this.hasAttached && this.overlay && this.active) {

                const positionBehavior = this.overlay.config.positionBehavior;

                if (positionBehavior && this.element) {

                    // tooltips can have multiple triggers, so we set the position behavior's origin
                    // to this trigger's element (position behavior configs can be live-updated)
                    positionBehavior.config = { ...positionBehavior.config, origin: this.element };
                }

                void this.overlay?.show();
            }

            this.updateTask = undefined;

        }, this.config.delay);
    }

    protected hide (): void {

        this.active = false;

        this.updateTask && cancelTask(this.updateTask);

        this.updateTask = delay(() => {

            if (!this.active) {

                void this.overlay?.hide();
            }

            this.updateTask = undefined;

        }, this.config.delay);
    }

    protected addAttributes (): void {

        this.attributeManager?.set('id', this.element?.id || this.id);
        this.attributeManager?.set('tabindex', this.element?.getAttribute('tabindex') ?? 0);
        this.attributeManager?.set('aria-describedby', this.overlay?.element?.id ?? '');
    }

    protected addListeners (): void {

        if (!this.element || !this.overlay?.element) return;

        this.eventManager.listen(this.element, 'mouseenter', event => this.handleMouseEnter(event as MouseEvent));
        this.eventManager.listen(this.element, 'mouseleave', event => this.handleMouseLeave(event as MouseEvent));
        this.eventManager.listen(this.element, 'focus', event => this.handleFocus(event as FocusEvent));
        this.eventManager.listen(this.element, 'blur', event => this.handleBlur(event as FocusEvent));
        this.eventManager.listen(this.element, 'keydown', event => this.handleKeyDown(event as KeyboardEvent));

        this.eventManager.listen(this.overlay.element, 'mouseenter', event => this.handleOverlayMouseEnter(event as MouseEvent));
        this.eventManager.listen(this.overlay.element, 'mouseleave', event => this.handleOverlayMouseLeave(event as MouseEvent));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleMouseEnter (event: MouseEvent): void {

        this.show();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleMouseLeave (event: MouseEvent): void {

        if (this.overlayHovered) return;

        this.hide();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleFocus (event: FocusEvent): void {

        this.show();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleBlur (event: FocusEvent): void {

        if (this.overlayHovered) return;

        this.hide();
    }

    protected handleKeyDown (event: KeyboardEvent): void {

        if (!this.overlay || event.target !== this.element) return;

        switch (event.key) {

            case ESCAPE:

                // don't handle ESCAPE if the overlay is hidden
                if (this.overlay.hidden) break;

                cancel(event);
                this.hide();
                break;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleOverlayMouseEnter (event: MouseEvent): void {

        // tooltip overlays can be shared between multiple trigger instances
        // ensure the overlay's current origin is this trigger, otherwise ignore
        if (this.overlay?.config.positionBehavior?.config.origin !== this.element) return;

        this.overlayHovered = true;

        this.show();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleOverlayMouseLeave (event: MouseEvent): void {

        // tooltip overlays can be shared between multiple trigger instances
        // ensure the overlay's current origin is this trigger, otherwise ignore
        if (this.overlay?.config.positionBehavior?.config.origin !== this.element) return;

        this.overlayHovered = false;

        this.hide();
    }
}
