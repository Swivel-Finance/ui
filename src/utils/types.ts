/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

export type Constructor<T extends Object> = {
    prototype: T;
    new(...args: any[]): T;
};

export type DeepPartial<T> = { [P in keyof T]?: Partial<T[P]> | undefined };
