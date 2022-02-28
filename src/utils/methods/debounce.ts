/**
 * Debounces a method
 *
 * @param method - the method to debounce
 * @param time - an optional time in ms to debounce by (default: 250)
 * @returns the debounced method
 */
export const debounce = <T extends unknown[], R> (method: (...args: T) => R, time = 250): ((...args: T) => void) => {

    let timeout: number | undefined;

    return (...args: T) => {

        window.clearTimeout(timeout);

        timeout = window.setTimeout(() => method.apply(this, args), time);
    };
};
