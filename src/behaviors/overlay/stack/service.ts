import type { OverlayBehavior } from '../overlay.js';

export class OverlayStack {

    protected stack = new Set<OverlayBehavior>();

    /**
     * Check if an overlay is active.
     *
     * @remarks
     * An overlay is considered active if it is either focused or has a descendant overlay which is focused.
     */
    active (overlay: OverlayBehavior): boolean {

        let focused = false;
        let active = false;
        let found = false;

        if (!overlay.hidden) {

            for (const current of this.stack) {

                found = found || current === overlay;
                focused = current.focused;
                active = found && focused;

                // we can exit the loop if we found a focused overlay
                // active will only be true, if we found `overlay` as the current or a previous overlay in the stack
                if (focused) break;
            }
        }

        return active;
    }

    /**
     * Get the parent overlay of an active overlay.
     *
     * @remarks
     * If an overlay is stacked, its parent overlay is the one from which it was opened.
     * The parent will be in the `stack` just before the `overlay`.
     */
    parent (overlay: OverlayBehavior): OverlayBehavior | undefined {

        let parent: OverlayBehavior | undefined;

        if (!this.stack.has(overlay)) return parent;

        for (const current of this.stack) {

            if (current === overlay) return parent;

            parent = current;
        }
    }

    /**
     * Update the stack.
     *
     * @remarks
     * The core idea of a stacked overlay system is, that any overlay can have descendant overlays
     * and there's direct ordered graph of parent overlays to their descendant overlays and only
     * one path can be active at a time (no overlay in the stack can have multiple stacked descendant
     * overlays open at the same time). This path is essentially the stack.
     *
     * The top-most overlay in the stack (the last one) is the current (usually focused) overlay.
     * Any other overlays in the stack are respective parent overlays of the current overlay and
     * are considered `active` as long as a descendant overlay (higher in the stack) has focus.
     *
     * When a stacked overlay is shown or hidden, the stack needs to be updated to maintain these rules:
     *
     * if an overlay is shown (added to the stack):
     * - find the overlay in the stack that contains the new overlay's trigger (if it has a trigger)
     * - hide any overlay in the stack above the one that contains the trigger (maintain a single path)
     * - add the new overlay as the top-most overlay to the stack
     *
     * if an overlay is hidden (removed from the stack):
     * - find the hiding overlay in the stack
     * - hide any overlay in the stack above the one that's hiding (these are descendants)
     * - remove the hiding overlay from the stack
     *
     * @param overlay - the stacked overlay to show or hide
     * @param show - `true` if the overlay is shown, `false` otherwise
     * @param detaching - `true` if the overlay is being detached
     */
    update (overlay: OverlayBehavior, show: boolean, detaching = false): void {

        // reverse the stack: the last overlay in the stack is the top-most and current overlay
        const stack = [...this.stack].reverse();

        stack.some(current => {

            // we are done if we find the overlay containig the showing overlay's trigger or the hiding overlay
            const done = show
                ? overlay.trigger?.element && current.element?.contains(overlay.trigger.element) || !overlay.trigger
                : overlay === current;

            if (!done) {

                // unless `done`, close the current overlay
                void current.hide(false, detaching);
            }

            return done;
        });

        if (show) {

            this.stack.add(overlay);

        } else {

            this.stack.delete(overlay);
        }
    }
}
