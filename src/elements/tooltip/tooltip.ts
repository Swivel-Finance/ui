import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { OverlayBehavior, OVERLAY_CONFIG_TOOLTIP, OVERLAY_TRIGGER_CONFIG_TOOLTIP, TooltipTriggerBehavior } from '../../behaviors/overlay/index.js';
import { PositionBehavior } from '../../behaviors/position/index.js';
import { POSITION_CONFIG_TOOLTIP } from '../constants/index.js';

@customElement('ui-tooltip')
export class TooltipElement extends LitElement {

    protected triggerBehaviors = new Map<HTMLElement, TooltipTriggerBehavior>();

    protected overlayBehavior = new OverlayBehavior({
        ...OVERLAY_CONFIG_TOOLTIP,
        positionBehavior: new PositionBehavior(POSITION_CONFIG_TOOLTIP),
    });

    connectedCallback (): void {

        if (this.overlayBehavior.moving) return;

        this.overlayBehavior.attach(this);

        this.connectTooltip();
    }

    disconnectedCallback (): void {

        if (this.overlayBehavior.moving) return;

        this.triggerBehaviors.forEach(behavior => behavior.detach());

        this.triggerBehaviors.clear();

        this.overlayBehavior.detach();
    }

    /**
     * Connect the tooltip instance to available triggers.
     *
     * @remarks
     * This method is called automatically when a tooltip instance is connected to the DOM. It will search elements
     * referring to this tooltip's id and instantiate and connect the appropriate tooltip trigger behaviors.
     * When dynamically adding/removing DOM elements that should act as triggers for this tooltip *after* the tooltip
     * is connected, call this method manually to ensure the updated DOM is queried and the triggers are connected.
     */
    connectTooltip (): void {

        const triggers = document.querySelectorAll<HTMLElement>(`[aria-describedby=${ this.id }], [aria-labelledby=${ this.id }]`);

        this.triggerBehaviors.forEach(behavior => behavior.detach());

        this.triggerBehaviors.clear();

        triggers.forEach(trigger => {

            const behavior = new TooltipTriggerBehavior(OVERLAY_TRIGGER_CONFIG_TOOLTIP);

            behavior.attach(trigger, this.overlayBehavior);

            this.triggerBehaviors.set(trigger, behavior);
        });
    }
}
