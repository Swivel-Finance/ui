/**
 * Cancel an `Event`.
 *
 * @remarks
 * This is a shorthand for calling
 * ```typescript
 * event.preventDefault();
 * event.stopPropagation();
 * ```
 *
 * @public
 */
export function cancel (event: Event): void {

    event.preventDefault();
    event.stopPropagation();
}
