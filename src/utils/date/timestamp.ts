/**
 * Creates a unix timestamp from a Date, number or string
 *
 * @remarks
 * If the value is a string, we assume it's already a unix timestamp and just parse to number.
 * (Usually timestamps retrieved from an API or smart contract are unix timestamps as strings,
 * whereas timestamps in JavaScript will typically be Dates or numbers in milliseconds.)
 */
export const unixTimestamp = (value: Date | number | string): number => {

    return (value instanceof Date)
        ? Math.floor(value.getTime() / 1000)
        : (typeof value === 'number')
            ? Math.floor(value / 1000)
            : parseInt(value);
};
