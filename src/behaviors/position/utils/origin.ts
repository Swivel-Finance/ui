import { VIEWPORT } from './constants.js';
import { hasPositionChanged, isPosition, Position } from './position.js';

export type Origin = Position | HTMLElement | typeof VIEWPORT;

export function hasOriginChanged (origin?: Origin, other?: Origin): boolean {

    return (isPosition(origin) && isPosition(other) && hasPositionChanged(origin, other)) || origin !== other;
}
