/* eslint-disable @typescript-eslint/no-unused-vars */
import { dispatch } from '../utils/events/index.js';

export abstract class Behavior<T extends HTMLElement = HTMLElement> {

    protected _attached = false;

    protected _element: T | undefined;

    /**
     * True if the behavior's {@link Behavior.attach} method was called
     *
     * @readonly
     */
    get hasAttached (): boolean {

        return this._attached;
    }

    /**
     * The element that the behavior is attached to
     *
     * @remarks
     * We only expose a getter for the element, so it can't be set directly, but has to be set via
     * the behavior's attach method.
     *
     * @readonly
     */
    get element (): T | undefined {

        return this._element;
    }

    /**
     * Attaches the behavior instance to an HTMLElement
     *
     * @param element - an optional HTMLElement to attach the behavior to
     * @param args - optional arguments which can be passed to the attach method
     * @returns a boolean indicating if the behavior was successfully attached
     */
    attach (element?: T, ...args: unknown[]): boolean {

        if (this.hasAttached) return false;

        this._element = element;

        this._attached = true;

        return true;
    }

    /**
     * Detaches the behavior instance
     *
     * @param args - optional arguments which can be passed to the detach method
     */
    detach (...args: unknown[]): boolean {

        if (!this.hasAttached) return false;

        this._element = undefined;

        this._attached = false;

        return true;
    }

    /**
     * Dispatches an `Event` on the behaviors `element`
     *
     * @param event - the event to dispatch
     */
    dispatch (event: Event): boolean;
    /**
     * Dispatches a `CustomEvent` on the behaviors `element`
     *
     * @param type - the event type
     * @param detail - optional event detail
     * @param init - optional event init
     */
    dispatch<T = unknown> (type: string, detail?: T, init?: EventInit): boolean;

    dispatch<T = unknown> (eventOrType: Event | string, detail?: T, init?: EventInit): boolean {

        if (this.hasAttached && this.element) {

            return (eventOrType instanceof Event)
                ? dispatch(this.element, eventOrType)
                : dispatch(this.element, eventOrType, detail, init);
        }

        return false;
    }
}
