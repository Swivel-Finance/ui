import { ElementEvent, ElementEventDetail } from '../../utils/events/index.js';
import type { InputElement } from './input.js';

export interface ValueChangeEventDetail<V = unknown, T extends InputElement<V> = InputElement<V>> extends ElementEventDetail<T> {
    current: V;
    previous: V;
    change: boolean;
}

export class ValueChangeEvent<V = unknown, T extends InputElement<V> = InputElement<V>> extends ElementEvent<T, ValueChangeEventDetail<V, T>> {

    type!: 'ui-value-changed';

    constructor (detail: ValueChangeEventDetail<V, T>, init?: EventInit) {

        super('ui-value-changed', detail, init);
    }
}

/**
 * Add the value change event to the global HTMLElementEventMap.
 */
declare global {
    interface HTMLElementEventMap {
        'ui-value-changed': ValueChangeEvent;
    }
}
