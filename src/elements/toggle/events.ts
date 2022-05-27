import { ElementEvent, ElementEventDetail } from '../../utils/events/index.js';
import { ToggleElement } from './toggle.js';

export interface ToggleChangeEventDetail<V = unknown, T extends ToggleElement<V> = ToggleElement<V>> extends ElementEventDetail<T> {
    checked: boolean;
    indeterminate: boolean;
    value?: V;
}

export class ToggleChangeEvent<V = unknown, T extends ToggleElement<V> = ToggleElement<V>> extends ElementEvent<T, ToggleChangeEventDetail<V, T>> {

    type!: 'ui-toggle-changed';

    constructor (detail: ToggleChangeEventDetail<V, T>, init?: EventInit) {

        super('ui-toggle-changed', detail, init);
    }
}

export interface ToggleElementEventMap<V = unknown> extends HTMLElementEventMap {
    'ui-toggle-changed': ToggleChangeEvent<V>;
}

/**
 * Add the value change event to the global HTMLElementEventMap.
 */
declare global {
    interface HTMLElementEventMap {
        'ui-toggle-changed': ToggleChangeEvent;
    }
}
