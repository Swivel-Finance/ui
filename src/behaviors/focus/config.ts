import { TABBABLE_CONFIG_DEFAULT } from './tabbable.js';

/**
 * The {@link FocusTrap} configuration interface
 */
export interface FocusTrapConfig {
    /**
     * A css selector string that matches all children that should be considered tabbable.
     */
    tabbableSelector: string;
    /**
     * Whether to trap the focus when tabbing past the first or last tabbable element.
     */
    trapFocus: boolean;
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
    tabbableSelector: TABBABLE_CONFIG_DEFAULT.tabbableSelector,
    trapFocus: true,
    wrapFocus: true,
    autoFocus: true,
    restoreFocus: true,
};
