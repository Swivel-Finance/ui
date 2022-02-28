import { VIEWPORT } from './constants.js';
import { isPosition, Position } from './position.js';

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function getBoundingBox (reference: Position | HTMLElement | typeof VIEWPORT | undefined): BoundingBox {

    const boundingBox: BoundingBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };

    if (reference === 'viewport') {

        boundingBox.width = window.innerWidth;
        boundingBox.height = window.innerHeight;

    } else if (reference instanceof HTMLElement) {

        const originRect = reference.getBoundingClientRect();

        boundingBox.x = originRect.left;
        boundingBox.y = originRect.top;
        boundingBox.width = originRect.width;
        boundingBox.height = originRect.height;

    } else if (isPosition(reference)) {

        boundingBox.x = reference.x;
        boundingBox.y = reference.y;
    }

    return boundingBox;
}
