import { EVENT_INIT_DEFAULT } from './event-init.js';

/**
 * Dispatches an `Event` on the target.
 *
 * @public
 */
export function dispatch (target: EventTarget, event: Event): boolean;

/**
 * Dispatches a `CustomEvent` on the target.
 *
 * @public
 */
export function dispatch<T = unknown> (target: EventTarget, type: string, detail?: T, eventInit?: Partial<EventInit>): boolean;

export function dispatch<T = unknown> (target: EventTarget, eventOrType: Event | string, detail?: T, eventInit: Partial<EventInit> = {}): boolean {

    const event = (eventOrType instanceof Event)
        ? eventOrType
        : new CustomEvent(eventOrType, {
            ...EVENT_INIT_DEFAULT,
            ...eventInit,
            detail,
        });

    return target.dispatchEvent(event);
}
