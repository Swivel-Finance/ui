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
     * We use a task to show the tooltip with a delay
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

        this.updateTask = delay(() => {

            if (this.hasAttached && this.overlay && this.active) {

                const positionBehavior = this.overlay.config.positionBehavior;

                if (positionBehavior && this.element) {

                    // tooltips can have multiple triggers, so we set the position behavior's origin
                    // to this trigger's element (position behavior configs can be live-updated)
                    positionBehavior.config.origin = this.element;
                }

                void this.overlay?.show();
            }

            this.updateTask = undefined;

        }, this.config.delay);
    }

    protected hide (): void {

        this.active = false;

        this.updateTask && cancelTask(this.updateTask);

        this.updateTask = undefined;

        void this.overlay?.hide();
    }

    protected addAttributes (): void {

        this.attributeManager?.set('id', this.element?.id || this.id);
        this.attributeManager?.set('tabindex', this.element?.getAttribute('tabindex') ?? 0);
        this.attributeManager?.set('aria-describedby', this.overlay?.element?.id ?? '');
    }

    protected addListeners (): void {

        if (!this.element || !this.overlay?.element) return;

        this.eventManager.listen(this.element, 'mouseenter', () => this.show());
        this.eventManager.listen(this.element, 'mouseleave', () => this.hide());
        this.eventManager.listen(this.element, 'focus', () => this.show());
        this.eventManager.listen(this.element, 'blur', () => this.hide());
        this.eventManager.listen(this.element, 'keydown', event => this.handleKeyDown(event as KeyboardEvent));
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
}
