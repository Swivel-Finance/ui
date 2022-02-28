import { EVENT_INIT_DEFAULT } from './event-init.js';

/**
 * The {@link ElementEvent} detail.
 *
 * @remarks
 * CustomEvents that cross shadow DOM boundaries get re-targeted. This means, the event's `target` property
 * is set to the custom element which holds the shadow DOM. We want to provide the original target in each
 * {@link ElementEvent} so global event listeners can easily access the event's original target.
 */
export interface ElementEventDetail<T extends HTMLElement = HTMLElement> {
    target: T;
}

/**
 * A base class for custom element events.
 *
 * @remarks
 * The `ElementEvent` class extends `CustomEvent` and simply provides the default `EventInit` object and its
 * typing ensures that the event `detail` contains a `target` value.
 */
export class ElementEvent<T extends HTMLElement = HTMLElement, V extends ElementEventDetail<T> = ElementEventDetail<T>> extends CustomEvent<V> {

    constructor (type: string, detail: V, init: EventInit = {}) {

        const eventInit: CustomEventInit<V> = {
            ...EVENT_INIT_DEFAULT,
            ...init,
            detail,
        };

        super(type, eventInit);
    }
}

/**
 * A type for enhancing a custom element's `addEventListener` method with event definitions from an event map.
 */
export interface MappedAddEventListener<T extends HTMLElement = HTMLElement, M extends HTMLElementEventMap = HTMLElementEventMap> {
    <K extends keyof M> (type: K, listener: (this: T, ev: M[K]) => unknown, options?: boolean | AddEventListenerOptions): void;
}

/**
 * A type for enhancing a custom element's `removeEventListener` method with event definitions from an event map.
 */
export interface MappedRemoveEventListener<T extends HTMLElement = HTMLElement, M extends HTMLElementEventMap = HTMLElementEventMap> {
    <K extends keyof M> (type: K, listener: (this: T, ev: M[K]) => unknown, options?: boolean | EventListenerOptions): void;
}
