/**
 * An event listener reference.
 *
 * @remarks
 * A `ListenerRef` caches the parameters of a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener|EventTarget.addEventListener()}
 * call, so a bound event listener can be easily removed later and duplicate event listeners can be prevented.
 *
 * @public
 */
export interface ListenerRef {
    readonly target: EventTarget;
    readonly type: string;
    readonly listener: EventListenerOrEventListenerObject | null;
    readonly options?: EventListenerOptions | boolean;
}

/**
 * A type guard for {@link ListenerRef} objects.
 *
 * @returns `true` if the provided `ref` is a {@link ListenerRef}
 *
 * @public
 */
export function isListenerRef (ref: unknown): ref is ListenerRef {

    const listenerRef = ref as ListenerRef;

    return typeof listenerRef === 'object'
        && typeof listenerRef.target === 'object'
        && typeof listenerRef.type === 'string'
        && (typeof listenerRef.listener === 'function' || typeof listenerRef.listener === 'object');
}

/**
 * A factory method for creating {@link ListenerRef} objects.
 *
 * @public
 */
export function createListenerRef (
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
): ListenerRef {

    return Object.freeze({
        target,
        type,
        listener,
        options,
    });
}

/**
 * Compares two {@link ListenerRef} objects.
 *
 * @returns `true` if both objects have the same target, type, listener and options
 *
 * @public
 */
export function compareListenerRefs (ref: ListenerRef, other: ListenerRef): boolean {

    if (ref === other) return true;

    return ref.target === other.target
        && ref.type === other.type
        && compareListeners(ref.listener, other.listener)
        && compareListenerOptions(ref.options, other.options);
}

/**
 * Compares two event listeners.
 *
 * @returns `true` if the listeners are the same
 *
 * @internal
 */
export function compareListeners (
    listener: EventListenerOrEventListenerObject | null,
    other: EventListenerOrEventListenerObject | null,
): boolean {

    // catches both listeners being null, a function or the same EventListenerObject
    if (listener === other) return true;

    // compares the handlers of two EventListenerObjects
    if (typeof listener === 'object' && typeof other === 'object') {

        return (listener as EventListenerObject).handleEvent === (other as EventListenerObject).handleEvent;
    }

    return false;
}

/**
 * Compares two event listener options.
 *
 * @returns `true` if the options are the same
 *
 * @internal
 */
export function compareListenerOptions (
    options?: boolean | AddEventListenerOptions,
    other?: boolean | AddEventListenerOptions,
): boolean {

    // catches both options being undefined or same boolean value
    if (options === other) return true;

    // compares two options objects
    if (typeof options === 'object' && typeof other === 'object') {

        return options.capture === other.capture
            && options.passive === other.passive
            && options.once === other.once;
    }

    return false;
}
