import { activeElement, setAttribute } from '../../utils/dom/index.js';
import { TAB } from '../../utils/index.js';
import { FocusTrapConfig, FOCUS_TRAP_CONFIG_DEFAULT } from './config.js';
import { FocusMonitor } from './focus-monitor.js';
import { getTabbables } from './tabbable.js';

const SELECTOR_ERROR = (selector: string) => `FocusTrap could not find element selector '${ selector }'. Review your FocusTrapConfig.`;

/**
 * The FocusTrap behavior
 *
 * @remarks
 * The FocusTrap behavior extends the {@link FocusMonitor} behavior and adds additional
 * functionality to it, like trapping the focus in the monitored element, auto wrapping
 * the focus order, as well as auto-focus and restore-focus. The behavior of the
 * FocusTrap can be defined through a {@link FocusTrapConfig}.
 */
export class FocusTrap extends FocusMonitor {

    protected tabbables?: HTMLElement[];

    protected start?: HTMLElement;

    protected end?: HTMLElement;

    protected previous?: HTMLElement;

    protected tabindex: string | null = null;

    protected config: FocusTrapConfig;

    constructor (config?: Partial<FocusTrapConfig>) {

        super();

        this.config = { ...FOCUS_TRAP_CONFIG_DEFAULT, ...config };
    }

    attach (element: HTMLElement): boolean {

        if (!super.attach(element)) return false;

        this.update();

        this.addAttributes();

        this.eventManager.listen(element, 'keydown', event => this.handleKeyDown(event as KeyboardEvent));

        if (this.config.autoFocus) {

            this.focusInitial();
        }

        return true;
    }

    detach (): boolean {

        if (!this.hasAttached) return false;

        if (this.config.restoreFocus) {

            this.restoreFocus();
        }

        this.removeAttributes();

        return super.detach();
    }

    focusInitial (): void {

        if (this.config.initialFocus) {

            const initialFocus = this.element?.querySelector<HTMLElement>(this.config.initialFocus);

            if (initialFocus) {

                this.focus(initialFocus);

            } else {

                console.error(SELECTOR_ERROR(this.config.initialFocus));
            }

        } else {

            this.focusFirst();
        }
    }

    focusFirst (): void {

        if (!this.element) return;

        this.focus(this.start ?? this.element);
    }

    focusLast (): void {

        if (!this.element) return;

        this.focus(this.end ?? this.element);
    }

    /**
     * Update the tabbables inside the focus trap.
     *
     * @remarks
     * This method should be called by components using a focus trap when changing the contents of the trap element.
     * // TODO: We could consider using a MutationObserver to automate this, but that seems heavy-handed.
     */
    update (): void {

        if (!this.element) return;

        this.tabbables = getTabbables(this.element, this.config);

        this.start = this.tabbables.length
            ? this.tabbables[0]
            : this.element;

        this.end = this.tabbables.length
            ? this.tabbables[this.tabbables.length - 1]
            : this.element;
    }

    protected addAttributes (): void {

        if (!this.element) return;

        this.tabindex = this.element.getAttribute('tabindex');

        setAttribute(this.element, 'tabindex', this.tabindex ?? 0);
    }

    protected removeAttributes (): void {

        if (!this.element) return;

        setAttribute(this.element, 'tabindex', this.tabindex);
    }

    protected storeFocus (element?: HTMLElement): void {

        if (this.previous) return;

        this.previous = element ?? activeElement();
    }

    protected restoreFocus (): void {

        // don't restore focus if it was already removed from the focus trap
        if (!this.previous || !this.focused) return;

        this.focus(this.previous);

        this.previous = undefined;
    }

    protected focus (element?: HTMLElement | null): void {

        // `document.body.focus()` has no effect, we neeed to blur the active element instead
        (!element || element === document.body)
            ? activeElement().blur()
            : element.focus(this.config.focusOptions);
    }

    protected handleKeyDown (event: KeyboardEvent): void {

        let forward = false;
        let backward = false;

        switch (event.key) {

            case TAB:

                forward = !event.shiftKey && event.target === this.end;
                backward = event.shiftKey && event.target === this.start;

                if (forward || backward) {

                    if (!this.config.trapFocus) {

                        // if `trapFocus` is turned off, ensure the correct tab order when tabbing out of the focus trap
                        // get all tabbables (ordered according to the natural tab sequence)
                        const tabbables = getTabbables(document.body);

                        // the next tabbable would be a tabbable sibling of the focus trap's `previous`
                        const next = this.previous && tabbables[tabbables.indexOf(this.previous) + (forward ? 1 : -1)] || null;

                        // if the focus trap element is a sibling of the trap's `previous`, we don't need to
                        // do anything and can let the browser handle the tab sequence naturally
                        // if the focus trap element isn't a sibling of the trap's `previous`, the trap element
                        // is somewhere else in the DOM (e.g. an overlay in the `body`) and we need to handle the
                        // tab sequence
                        if (!this.element?.contains(next)) {

                            event.preventDefault();

                            this.focus(next);
                        }

                    } else if (this.config.wrapFocus) {

                        event.preventDefault();

                        // if `wrapFocus` is turned on, wrap the focus to the first/last tabbable in the trap
                        forward ? this.focusFirst() : this.focusLast();
                    }
                }

                break;
        }
    }

    protected handleFocusIn (event: FocusEvent): void {

        super.handleFocusIn(event);

        this.storeFocus(event.relatedTarget as HTMLElement ?? document.body);

        // TODO: We could consider using a MutationObserver to automate this, but that seems heavy-handed
        // focus changes inside a focus trap can occur naturally (by pressing tab) or synthetically through
        // another behavior (e.g. list behavior) changing tabindexes and moving the focus (roving tabindex)
        // in the latter case we want to make sure to update the trap's tabbables (changed tabindex means changed tabbables)
        this.update();
    }
}
