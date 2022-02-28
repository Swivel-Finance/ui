import { ElementEvent, ElementEventDetail } from '../../utils/events/index.js';

export interface OpenChangeEventDetail<T extends HTMLElement = HTMLElement> extends ElementEventDetail<T> {
    open: boolean;
}

export class OpenChangeEvent<T extends HTMLElement = HTMLElement> extends ElementEvent<T, OpenChangeEventDetail<T>> {

    type!: 'ui-open-changed';

    constructor (detail: OpenChangeEventDetail<T>, init?: EventInit) {

        super('ui-open-changed', detail, init);
    }
}

/**
 * Add the event to the global HTMLElementEventMap.
 */
declare global {
    interface HTMLElementEventMap {
        'ui-open-changed': OpenChangeEvent;
    }
}
