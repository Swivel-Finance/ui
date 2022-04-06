/**
 * A CSS selector for matching elements which are not disabled or removed from the tab order
 */
export const INTERACTIVE_SELECTOR = ':not([hidden]):not([aria-hidden=true]):not([disabled]):not([tabindex^="-"])';

/**
 * An array of CSS selectors to match generally tabbable elements
 */
export const ELEMENT_SELECTORS = [
    'a[href]',
    'area[href]',
    'button',
    'input:not([type=hidden])',
    'select',
    'textarea',
    'details',
    'details>summary:first-of-type',
    '[contenteditable]:not([contenteditable=false])',
    '[tabindex]',
];

/**
 * An array of CSS selectors to match interactive, tabbable elements
 */
export const TABBABLE_SELECTORS = ELEMENT_SELECTORS.map(ELEMENT => `${ ELEMENT }${ INTERACTIVE_SELECTOR }`);

export interface TabbableConfig {
    tabbableSelector: string;
    includeRoot: boolean;
}

export const TABBABLE_CONFIG_DEFAULT: TabbableConfig = {
    tabbableSelector: TABBABLE_SELECTORS.join(','),
    includeRoot: false,
};

interface OrderedTabbable {
    order: number;
    tabindex: number;
    element: HTMLElement;
}

/**
 * A function to sort tabbables with a tabindex > 0.
 *
 * @remarks
 * Sorts elements by their tabindex value in ascending order. If elements have the same tabindex
 * it uses their order in the document to achieve the same tab sequence as the browser would.
 */
const sortOrdered = (a: OrderedTabbable, b: OrderedTabbable): number => (a.tabindex === b.tabindex)
    ? a.order - b.order
    : a.tabindex - b.tabindex;

/**
 * A function to filter tabbables which are not displayed.
 *
 * @remarks
 * This method relies on the `offestParent` property which will return null, when an element or
 * its ancestor is set to `display: none`. This does not work for elements with `visibility: hidden`,
 * but it's fast and should work for most of our cases.
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent,
 *
 */
const filterHidden = (element: HTMLElement): boolean => !!element.offsetParent;

/**
 * Get all tabbable elements in a root element in their tab order.
 */
export const getTabbables = (root: HTMLElement, options: Partial<TabbableConfig> = {}): HTMLElement[] => {

    const config = { ...TABBABLE_CONFIG_DEFAULT, ...options };

    // select tabbable elements by css selector
    let tabbables = Array.from(root.querySelectorAll<HTMLElement>(config.tabbableSelector));

    // optionally include the root element
    if (config.includeRoot && Element.prototype.matches.call(root, config.tabbableSelector)) {

        tabbables.unshift(root);
    }

    // filter out hidden elements
    tabbables = tabbables.filter(filterHidden);

    const regular: HTMLElement[] = [];
    const ordered: { order: number; tabindex: number; element: HTMLElement; }[] = [];

    // ensure the tab order for elements with tabindex > 0
    tabbables.forEach((tabbable, index) => {

        if (tabbable.tabIndex > 0) {

            ordered.push({
                order: index,
                tabindex: tabbable.tabIndex,
                element: tabbable,
            });

        } else {

            regular.push(tabbable);
        }
    });

    return ordered.sort(sortOrdered).map(item => item.element).concat(regular);
};
