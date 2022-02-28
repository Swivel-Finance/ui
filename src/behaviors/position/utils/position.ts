export interface Position {
    x: number;
    y: number;
}

export const POSITION_DEFAULT: Position = {
    x: 0,
    y: 0,
};

export function isPosition (position: unknown): position is Position {

    return typeof (position as Position).x === 'number' && typeof (position as Position).y === 'number';
}

export function hasPositionChanged (position?: Position, other?: Position): boolean {

    if (position && other) {

        return position.x !== other.x
            || position.y !== other.y;
    }

    return position !== other;
}
