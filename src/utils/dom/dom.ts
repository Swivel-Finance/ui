import { isNullish } from '../checks.js';

/**
 * Check if an element is disabled
 */
export const isDisabled = (element: HTMLElement): boolean => {

    return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
};

/**
 * Get the currently active element
 *
 * @remarks
 * Gets the currently active element, but pierces shadow roots to find the active element
 * also within a custom element which has a shadow root.
 */
export const activeElement = (): HTMLElement => {

    let shadowRoot: DocumentOrShadowRoot | null = document;
    let activeElement: Element = shadowRoot.activeElement ?? document.body;

    while (shadowRoot && shadowRoot.activeElement) {

        activeElement = shadowRoot.activeElement;
        shadowRoot = activeElement.shadowRoot;
    }

    return activeElement as HTMLElement;
};

/**
 * Set an attribute value on an element
 *
 * @remarks
 * The attribute value can be a primitive type and will be cast to `string`. If the value is
 * `undefined` or `null` the attribute will be removed. For non-aria attributes, boolean values
 * will add or remove the attribute, whereas for aria attributes, boolean values are stringified.
 */
export function setAttribute<T extends Element = Element> (element: T, attributeName: string, value: string | number | boolean | null | undefined): void {

    if (!attributeName.startsWith('aria-') && typeof value === 'boolean') {

        value = value ? '' : null;
    }

    if (isNullish(value)) {

        element.removeAttribute(attributeName);

    } else {

        element.setAttribute(attributeName, typeof value === 'string' ? value : value.toString());
    }
}

/**
 * Set a property value on an element
 */
export function setProperty<T extends Element = Element, V = unknown> (element: T, propertyKey: PropertyKey, value: V): void {

    element[propertyKey as keyof T] = value as unknown as T[keyof T];
}
