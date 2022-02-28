export interface Offset<T extends string | number | undefined = string | number | undefined> {
    horizontal: T;
    vertical: T;
}

export function hasOffsetChanged (offset?: Partial<Offset>, other?: Partial<Offset>): boolean {

    if (offset && other) {

        return offset.horizontal !== other.horizontal
            || offset.vertical !== other.vertical;
    }

    return offset !== other;
}
