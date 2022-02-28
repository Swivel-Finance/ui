import { ElementEvent, ElementEventDetail } from '../../utils/events/index.js';

export interface FocusChangeEventDetail<T extends HTMLElement = HTMLElement> extends ElementEventDetail<T> {
    hasFocus: boolean;
    relatedTarget?: HTMLElement;
}

/**
 * The FocusChangeEvent
 *
 * @remarks
 * The FocusChangeEvent is dispatched by the {@link FocusMonitor} *after* the focus state of the
 * monitored element has changed. This means, calling {@link activeElement} in an event handler
 * attached to this event will return the active element after the focus change. This is different
 * to focusin/focusout. Additionally, FocusChangeEvent is only triggered, when the focus moves into
 * the monitored element or out of the monitored element, but not when the focus moves within the
 * monitored element. FocusChangeEvent bubbles up the DOM.
 */
export class FocusChangeEvent<T extends HTMLElement = HTMLElement> extends ElementEvent<T, FocusChangeEventDetail<T>> {

    type!: 'ui-focus-changed';

    constructor (detail: FocusChangeEventDetail<T>, init?: EventInit) {

        super('ui-focus-changed', detail, init);
    }
}

/**
 * Add the FocusChangeEvent to the global HTMLElementEventMap.
 */
declare global {
    interface HTMLElementEventMap {
        'ui-focus-changed': FocusChangeEvent;
    }
}
