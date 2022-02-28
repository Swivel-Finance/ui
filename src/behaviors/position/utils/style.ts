export interface PositionStyles {
    position?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
    minWidth?: string;
    minHeight?: string;
}

const STYLE_NAMES: Record<keyof PositionStyles, string> = {
    position: 'position',
    top: 'top',
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    width: 'width',
    maxWidth: 'max-width',
    minWidth: 'min-width',
    height: 'height',
    maxHeight: 'max-height',
    minHeight: 'min-height',
};

export function style (value: string | number | null | undefined): string {

    return (typeof value === 'number') ? `${ value }px` : value ?? '';
}

export function styleAttribute (styles: PositionStyles): string {

    return (Object.entries(styles) as [keyof PositionStyles, string | undefined][]).reduce((attribute, [key, value]) => {

        // ignore empty values and keys which are not part of the `PositionStyles` interface
        return value && STYLE_NAMES[key]
            ? `${ attribute }${ STYLE_NAMES[key] }:${ value };`
            : attribute;

    }, '');
}
