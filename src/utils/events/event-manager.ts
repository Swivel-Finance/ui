/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { dispatch } from './dispatch.js';
import { compareListenerRefs, createListenerRef, isListenerRef, ListenerRef } from './listener-ref.js';

/**
 * A class for managing event listeners.
 *
 * @remarks
 * The `EventManager` class can be used to handle multiple event listeners on multiple targets. It caches all event
 * listeners and can remove them individually or all together. This can be useful when event listeners need to be
 * added and removed during the lifetime of a custom element and makes manually saving references to targets,
 * listeners and options unnecessary.
 *
 * ```ts
 *  // create an EventManager instance
 *  const manager = new EventManager();
 *
 *  // you can save a reference (ListenerRef) to the added event listener if you need to manually remove it later
 *  const ref = manager.listen(document, 'scroll', event => {...});
 *
 *  // ...or ignore the reference if you don't need it
 *  manager.listen(document.body, 'click', event => {...});
 *
 *  // you can remove a specific event listener using a reference
 *  manager.unlisten(ref);
 *
 *  // ...or remove all previously added event listeners in one go
 *  manager.unlistenAll();
 * ```
 *
 * @public
 */
export class EventManager {

    protected refs = new Set<ListenerRef>();

    /**
     * Adds the event listener to the target of the {@link ListenerRef} object
     *
     * @returns The {@link ListenerRef} which was added or undefined if a matching event binding already exists
     */
    listen (ref: ListenerRef): ListenerRef | undefined;

    /**
     * Adds an event listener to the target
     *
     * @returns The {@link ListenerRef} which was added or undefined if a matching event binding already exists
     */
    listen (target: EventTarget, type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): ListenerRef | undefined;

    listen (
        targetOrRef: ListenerRef | EventTarget,
        type?: string,
        listener?: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
    ): ListenerRef | undefined {

        const ref = isListenerRef(targetOrRef)
            ? targetOrRef
            : createListenerRef(targetOrRef, type!, listener!, options);

        if (!this.hasListener(ref)) {
            ref.target.addEventListener(ref.type, ref.listener, ref.options);
            this.refs.add(ref);
            return ref;
        }
    }

    /**
     * Removes the event listener from the target of the {@link ListenerRef} object
     *
     * @returns The {@link ListenerRef} which was removed or undefined if no matching event binding exists
     */
    unlisten (ref: ListenerRef): ListenerRef | undefined;

    /**
     * Removes the event listener from the target
     *
     * @returns The {@link ListenerRef} which was removed or undefined if no matching event binding exists
     */
    unlisten (
        target: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean,
    ): ListenerRef | undefined;

    unlisten (
        targetOrRef: ListenerRef | EventTarget,
        type?: string,
        listener?: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean,
    ): ListenerRef | undefined {

        const ref = isListenerRef(targetOrRef)
            ? this.findListener(targetOrRef)
            : this.findListener(targetOrRef, type!, listener!, options);

        if (ref) {
            ref.target.removeEventListener(ref.type, ref.listener, ref.options);
            this.refs.delete(ref);
            return ref;
        }
    }

    /**
     * Removes all event listeners from their targets
     */
    unlistenAll (): void {

        this.refs.forEach(ref => this.unlisten(ref));
    }

    /**
     * Dispatches an `Event` on the target
     */
    dispatch (target: EventTarget, event: Event): boolean;

    /**
     * Dispatches a `CustomEvent` on the target
     */
    dispatch<T = unknown> (target: EventTarget, type: string, detail?: T, eventInit?: Partial<EventInit>): boolean;

    dispatch<T = unknown> (target: EventTarget, eventOrType: Event | string, detail?: T, eventInit: Partial<EventInit> = {}): boolean {

        return (eventOrType instanceof Event)
            ? dispatch(target, eventOrType)
            : dispatch(target, eventOrType, detail, eventInit);
    }

    /**
     * Checks if a listener exists that matches the {@link ListenerRef} object.
     */
    hasListener (ref: ListenerRef): boolean;

    /**
     * Checks if a listener exists for the specified `target`, `type`, `listener` and `options`.
     */
    hasListener (
        target: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
    ): boolean;

    hasListener (
        targetOrRef: ListenerRef | EventTarget,
        type?: string,
        listener?: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
    ): boolean {

        return (isListenerRef(targetOrRef)
            ? this.findListener(targetOrRef)
            : this.findListener(targetOrRef, type!, listener!, options)) !== undefined;
    }

    /**
     * Finds an existing {@link ListenerRef} that matches the `ref` object.
     */
    findListener (ref: ListenerRef): ListenerRef | undefined;

    /**
     * Finds an existing {@link ListenerRef} that matches the specified `target`, `type`, `listener` and `options`.
     */
    findListener (
        target: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
    ): ListenerRef | undefined;

    findListener (
        targetOrRef: ListenerRef | EventTarget,
        type?: string,
        listener?: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
    ): ListenerRef | undefined {

        const searchRef: ListenerRef = isListenerRef(targetOrRef)
            ? targetOrRef
            : createListenerRef(targetOrRef, type!, listener!, options);

        let resultRef: ListenerRef | undefined;

        if (this.refs.has(searchRef)) return searchRef;

        // TODO: every time we add a new event listener, this check runs, as the ref
        // does not exist in te set yet... that becomes expensive
        // maybe use a weakmap: element => map[event-type, listener]?
        for (const ref of this.refs.values()) {

            if (compareListenerRefs(searchRef, ref)) {
                resultRef = ref;
                break;
            }
        }

        return resultRef;
    }
}
