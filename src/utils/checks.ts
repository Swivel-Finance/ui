/* eslint-disable @typescript-eslint/ban-types */

export const isNullish = (value: unknown): value is null | undefined => (value === null || value === undefined);

export const isEmpty = (value: unknown): value is null | undefined | '' => isNullish(value) || value === '';

/**
 * Ensures `hasOwnProperty` is not modified or unavailable, e.g. after `Object.create(null)`
 */
export const hasOwnProperty = (target: Object, propertyKey: PropertyKey): boolean => {

    return Object.prototype.hasOwnProperty.call(target, propertyKey);
};
