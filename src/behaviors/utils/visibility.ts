import { animationsDone } from '../../utils/dom/animations.js';
import { ClassNames, CLASS_MAP } from './class-map.js';

interface VisibilityTarget extends HTMLElement {
    __uiVisible?: boolean;
}

export const toggleVisibility = async (
    element: HTMLElement,
    visible: boolean,
    animated = true,
    classes: Partial<Record<ClassNames, string>> = {},
): Promise<void> => {

    // store the current visibility target on the element in order to check at a later point if it was changed
    // (this enables asynchronous waiting for animations and cancellation of visibility changes)
    (element as VisibilityTarget).__uiVisible = visible;

    if (visible) {

        element.hidden = !visible;
        // when removing the hidden attribute we need to force a repaint,
        // otherwise following class changes won't trigger any transitions
        // (`hidden` usually has a `display: none` style, affecting other css properties like they're `unset`)
        forceRepaint(element);
    }

    const classMap = { ...CLASS_MAP, ...classes };

    element.classList.add(visible ? classMap.visible : classMap.invisible);
    element.classList.remove(visible ? classMap.invisible : classMap.visible);

    if (animated) {

        element.classList.add(visible ? classMap.animateIn : classMap.animateOut);

        await animationsDone(element);

        element.classList.remove(visible ? classMap.animateIn : classMap.animateOut);

        // animations are awaited asynchronously, so there is a possibility that the element's visibility
        // was toggled in the meantime - if that's the case we stop execution here
        if ((element as VisibilityTarget).__uiVisible !== visible) return;
    }

    if (!visible) element.hidden = !visible;

    (element as VisibilityTarget).__uiVisible = undefined;
};

/**
 * A helper to force the browser to perform a repaint.
 *
 * @remarks
 * By calculating the `offsetHeight` of an element, the browser is forced to perform a repaint
 * of an element if there are any pending attribute or style changes (e.g. like setting hidden).
 */
const forceRepaint = (element: HTMLElement) => element.offsetHeight;
