export interface Size<T extends string | number | undefined = string | number | undefined> {
    width?: T;
    height?: T;
    maxWidth?: T;
    maxHeight?: T;
    minWidth?: T;
    minHeight?: T;
}

export function hasSizeChanged (size?: Size, other?: Size): boolean {

    if (size && other) {

        return size.width !== other.width
            || size.height !== other.height
            || size.maxWidth !== other.maxWidth
            || size.maxHeight !== other.maxHeight
            || size.minWidth !== other.minWidth
            || size.minHeight !== other.minHeight;
    }

    return size !== other;
}
