/**
 * The default EventInit object
 *
 * @remarks
 * In most cases we want CustomEvents to bubble, cross shadow DOM boundaries and be cancelable.
 * This default configuration ensures these properties.
 *
 * @internal
 */
export const EVENT_INIT_DEFAULT: EventInit = {
    bubbles: true,
    cancelable: true,
    composed: true,
};
