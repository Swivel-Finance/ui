/**
 * Throttle a method
 *
 * @param method - the method to throttle
 * @param time - an optional time in ms to throttle by (default: 1000)
 * @returns the throttled method
 */
export const throttle = <T extends unknown[], R> (method: (...args: T) => R, time = 1000): ((...args: T) => void) => {

    let timeout: number | undefined;
    let params: T;

    return (...args: T) => {

        params = args;

        if (timeout) return;

        timeout = window.setTimeout(
            () => {
                timeout = undefined;
                method.apply(this, params);
            },
            time,
        );
    };
};
