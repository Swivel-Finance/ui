import { BoundingBox } from './bounding-box.js';
import { hasOffsetChanged, Offset } from './offset.js';
import { Position } from './position.js';

export type AlignmentOption = 'start' | 'center' | 'end';

export interface Alignment {
    horizontal: AlignmentOption;
    vertical: AlignmentOption;
}

export interface AlignmentPair {
    origin: Alignment;
    target: Alignment;
    offset: Offset<number>;
}

export interface AlignmentConfig {
    origin: Alignment;
    target: Alignment;
    offset?: Partial<Offset>;
}

export const ALIGNMENT_CONFIG_DEFAULT: AlignmentConfig = {
    origin: {
        horizontal: 'center',
        vertical: 'center',
    },
    target: {
        horizontal: 'center',
        vertical: 'center',
    },
};

export function isAlignment (alignment: unknown): alignment is Alignment {

    return typeof (alignment as Alignment).horizontal === 'string' && typeof (alignment as Alignment).vertical === 'string';
}

export function hasAlignmentChanged (alignment: Alignment, other: Alignment): boolean {

    if (alignment && other) {

        return alignment.horizontal !== other.horizontal
            || alignment.vertical !== other.vertical;
    }

    return alignment !== other;
}

export function hasAlignmentPairChanged (alignmentPair?: AlignmentConfig, other?: AlignmentConfig): boolean {

    if (alignmentPair && other) {

        return hasAlignmentChanged(alignmentPair.target, other.target)
            || hasAlignmentChanged(alignmentPair.origin, other.origin)
            || hasOffsetChanged(alignmentPair.offset, other.offset);
    }

    return alignmentPair !== other;
}

export function getAlignmentPosition (elementBox: BoundingBox, elementAlignment: Alignment): Position {

    const position: Position = { x: 0, y: 0 };

    switch (elementAlignment.horizontal) {

        case 'start':
            position.x = elementBox.x;
            break;

        case 'center':
            position.x = elementBox.x + elementBox.width / 2;
            break;

        case 'end':
            position.x = elementBox.x + elementBox.width;
            break;
    }

    switch (elementAlignment.vertical) {

        case 'start':
            position.y = elementBox.y;
            break;

        case 'center':
            position.y = elementBox.y + elementBox.height / 2;
            break;

        case 'end':
            position.y = elementBox.y + elementBox.height;
            break;
    }

    return position;
}

export function getAlignedPosition (originBox: BoundingBox, targetBox: BoundingBox, alignment: AlignmentPair): Position {

    const originPosition = getAlignmentPosition(originBox, alignment.origin);
    const targetPosition = getAlignmentPosition({ ...targetBox, x: 0, y: 0 }, alignment.target);

    const offsetH = (alignment.target.horizontal === 'start')
        ? alignment.offset.horizontal
        : (alignment.target.horizontal === 'end')
            ? -1 * alignment.offset.horizontal
            : 0;

    const offsetV = (alignment.target.vertical === 'start')
        ? alignment.offset.vertical
        : (alignment.target.vertical === 'end')
            ? -1 * alignment.offset.vertical
            : 0;

    return {
        x: originPosition.x - targetPosition.x + offsetH,
        y: originPosition.y - targetPosition.y + offsetV,
    };
}
