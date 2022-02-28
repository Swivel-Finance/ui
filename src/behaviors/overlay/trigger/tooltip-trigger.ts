import { CancelError, delay, TaskReference } from '../../../utils/async/index.js';
import { OverlayTriggerConfig } from './config.js';
import { OverlayTriggerBehavior } from './overlay-trigger.js';

export const OVERLAY_TRIGGER_CONFIG_TOOLTIP: OverlayTriggerConfig = {
    role: 'tooltip',
    delay: 500,
};

export class TooltipTriggerBehavior extends OverlayTriggerBehavior {

    protected willShow?: TaskReference;

    constructor (config?: Partial<OverlayTriggerConfig>) {

        super();

        this.config = { ...OVERLAY_TRIGGER_CONFIG_TOOLTIP, ...config };
    }

    protected show () {

        this.willShow = delay(() => {

            if (this.hasAttached) void this.overlay?.show();

            this.willShow = undefined;

        }, this.config.delay);

        this.willShow.done.catch(error => {

            if (!(error instanceof CancelError)) throw error;
        });
    }

    protected hide () {

        if (this.willShow) {

            this.willShow.cancel();
            this.willShow = undefined;

        } else {

            void this.overlay?.hide();
        }
    }

    protected addAttributes () {

        this.attributeManager?.set('id', this.element?.id || this.id);
        this.attributeManager?.set('tabindex', 0);
        this.attributeManager?.set('aria-describedby', this.overlay?.element?.id ?? '');
    }

    protected addListeners () {

        if (!this.element || !this.overlay?.element) return;

        this.eventManager.listen(this.element, 'mouseenter', () => this.show());
        this.eventManager.listen(this.element, 'mouseleave', () => this.hide());
        this.eventManager.listen(this.element, 'focus', () => this.show());
        this.eventManager.listen(this.element, 'blur', () => this.hide());
    }
}
