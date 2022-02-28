import { activeElement, setAttribute } from '../../utils/dom/index.js';
import { TAB } from '../../utils/index.js';
import { FocusMonitor } from './focus-monitor.js';

const SELECTOR_ERROR = (selector: string) => `FocusTrap could not find element selector '${ selector }'. Review your FocusTrapConfig.`;

/**
 * A CSS selector for matching elements which are not disabled or removed from the tab order
 *
 * @private
 * @internal
 */
const INTERACTIVE = ':not([hidden]):not([aria-hidden=true]):not([disabled]):not([tabindex^="-"])';

/**
 * An array of CSS selectors to match generally tabbable elements
 *
 * @private
 * @internal
 */
const ELEMENTS = [
    'a[href]',
    'area[href]',
    'button',
    'input',
    'select',
    'textarea',
    'iframe',
    '[contentEditable]',
    '[tabindex]',
];

/**
 * An array of CSS selectors to match interactive, tabbable elements
 */
export const TABBABLES = ELEMENTS.map(ELEMENT => `${ ELEMENT }${ INTERACTIVE }`);

/**
 * The {@link FocusTrap} configuration interface
 */
export interface FocusTrapConfig {
    /**
     * A css selector string that matches all children that should be considered tabbable.
     */
    tabbableSelector: string;
    /**
     * Whether to "wrap around" the focus when tabbing past the first or last tabbable element.
     */
    wrapFocus: boolean;
    /**
     * Whether to automatically move the focus to the initial focusable element after attaching the behavior.
     */
    autoFocus: boolean;
    /**
     * Whether to automatically restore the focus to the previously focused element when detaching the behavior.
     */
    restoreFocus: boolean;
    /**
     * A CSS selector string that matches the initial focusable element.
     */
    initialFocus?: string;
    /**
     * Allows to prevent scrolling into view when focus is initially set and wrapped around.
     */
    focusOptions?: FocusOptions;
}

/**
 * The default {@link FocusTrap} configuration
 */
export const FOCUS_TRAP_CONFIG_DEFAULT: FocusTrapConfig = {
    tabbableSelector: TABBABLES.join(','),
    wrapFocus: true,
    autoFocus: true,
    restoreFocus: true,
};

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

    protected tabbables?: NodeListOf<HTMLElement>;

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

        // don't restore focus if it was already removed from the focus trap
        if (this.config.restoreFocus && this.focused) {

            this.restoreFocus();
        }

        this.removeAttributes();

        return super.detach();
    }

    focusInitial () {

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

    focusFirst () {

        if (!this.element) return;

        this.focus(this.start ?? this.element);
    }

    focusLast () {

        if (!this.element) return;

        this.focus(this.end ?? this.element);
    }

    update () {

        if (!this.hasAttached) return;

        this.tabbables = this.element?.querySelectorAll(this.config.tabbableSelector);

        if (this.element && this.tabbables) {

            this.start = this.tabbables.length
                ? this.tabbables.item(0)
                : this.element;

            this.end = this.tabbables.length
                ? this.tabbables.item(this.tabbables.length - 1)
                : this.element;
        }
    }

    protected addAttributes () {

        if (!this.element) return;

        this.tabindex = this.element.getAttribute('tabindex');

        setAttribute(this.element, 'tabindex', this.tabindex ?? 0);
    }

    protected removeAttributes () {

        if (!this.element) return;

        setAttribute(this.element, 'tabindex', this.tabindex);
    }

    protected storeFocus (element?: HTMLElement) {

        if (!this.previous) {

            this.previous = element ?? activeElement();
        }
    }

    protected restoreFocus () {

        if (this.previous) {

            this.focus(this.previous);

            this.previous = undefined;
        }
    }

    protected focus (element: HTMLElement) {

        element.focus(this.config.focusOptions);
    }

    protected handleKeyDown (event: KeyboardEvent) {

        switch (event.key) {

            case TAB:

                if (event.shiftKey && event.target === this.start) {

                    event.preventDefault();

                    if (this.config.wrapFocus) this.focusLast();

                } else if (!event.shiftKey && event.target === this.end) {

                    event.preventDefault();

                    if (this.config.wrapFocus) this.focusFirst();
                }

                break;
        }
    }

    protected handleFocusIn (event: FocusEvent) {

        super.handleFocusIn(event);

        this.storeFocus(event.relatedTarget as HTMLElement ?? document.body);
    }
}
