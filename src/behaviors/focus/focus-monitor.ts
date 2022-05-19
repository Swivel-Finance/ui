import { task } from '../../utils/async/index.js';
import { activeElement } from '../../utils/dom/index.js';
import { cancel, EventManager } from '../../utils/events/index.js';
import { Behavior } from '../behavior.js';
import { FocusChangeEvent } from './events';

/**
 * The FocusMonitor behavior
 *
 * @remarks
 * The FocusMonitor behavior can be attached to an element to monitor the focus state
 * of the element and its descendants. It dispatches a {@link FocusChangeEvent} if
 * the focus is moved into the element (or one of its descendants) or if the focus
 * moves out.
 */
export class FocusMonitor extends Behavior {

    protected eventManager = new EventManager();

    /**
     * The previous focus state (before the last FocusChangeEvent was dispatched)
     */
    protected hadFocus = false;

    /**
     * The current focus state
     */
    protected hasFocus = false;

    /**
     * The current focus state
     */
    get focused (): boolean {

        return this.hasFocus;
    }

    attach (element: HTMLElement): boolean {

        if (!super.attach(element)) return false;

        // set initial focus state
        this.hasFocus = element.contains(activeElement()) ?? false;

        this.eventManager.listen(element, 'focusin', event => this.handleFocusIn(event as FocusEvent));
        this.eventManager.listen(element, 'focusout', event => this.handleFocusOut(event as FocusEvent));
        this.eventManager.listen(element, 'ui-focus-changed', event => this.handleFocusChange(event as FocusChangeEvent));

        return true;
    }

    detach (): boolean {

        if (!this.hasAttached) return false;

        this.eventManager.unlistenAll();

        // reset focus state
        this.hadFocus = false;
        this.hasFocus = false;

        return super.detach();
    }

    protected handleFocusIn (event: FocusEvent): void {

        if (!this.hasFocus) {

            this.hasFocus = true;

            // schedule to dispatch a FocusChangeEvent in the next macro-task to make
            // sure it is dispatched after the focus has moved
            // we also check that focus state hasn't changed until the macro-task
            task(() => this.focused && this.notifyFocusChange(event));
        }
    }

    protected handleFocusOut (event: FocusEvent): void {

        if (this.hasFocus) {

            this.hasFocus = false;

            // schedule to dispatch a FocusChangeEvent in the next macro-task to make
            // sure it is dispatched after the focus has moved
            // we also check that focus state hasn't changed until the macro-task
            task(() => !this.focused && this.notifyFocusChange(event));
        }
    }

    protected handleFocusChange (event: FocusChangeEvent): void {

        // swallow FocusChangeEvents from nested FocusMonitors: any code observing
        // this FocusMonitor shouldn't get events from nested FocusMonitors
        if (event.detail.target !== this.element) {

            cancel(event);
        }
    }

    protected notifyFocusChange (event: FocusEvent): void {

        if (!this.hasAttached) return;

        // we only need to dispatch an event if our current focus state is different
        // than the last time we dispatched an event - this filters out cases where
        // we have a consecutive focusout/focusin event when the focus moves within
        // the monitored element (we don't want to notify if focus changes within)
        if (this.hasFocus !== this.hadFocus) {

            this.hadFocus = this.hasFocus;

            this.dispatch(new FocusChangeEvent({
                hasFocus: this.focused,
                target: this.element as HTMLElement,
                relatedTarget: event.relatedTarget as HTMLElement,
            }));
        }
    }
}
