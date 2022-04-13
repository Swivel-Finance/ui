import { ClassNames, CLASS_MAP } from '../utils/index.js';
import { AlignmentConfig, ALIGNMENT_CONFIG_DEFAULT, hasAlignmentPairChanged, hasOriginChanged, hasSizeChanged, Offset, Origin, ORIGIN, Size, VIEWPORT } from './utils/index.js';

export interface PositionConfig extends Size<typeof ORIGIN | string | number | undefined> {
    classes: Record<ClassNames, string>;
    origin: Origin;
    alignment: AlignmentConfig;
    safeZone?: Partial<Offset>;
}

export const POSITION_CONFIG_DEFAULT: PositionConfig = {
    classes: CLASS_MAP,
    origin: VIEWPORT,
    alignment: { ...ALIGNMENT_CONFIG_DEFAULT },
    safeZone: {
        horizontal: 0,
        vertical: 0,
    },
};

export const POSITION_CONFIG_FULLSCREEN: PositionConfig = {
    ...POSITION_CONFIG_DEFAULT,
    width: '100vw',
    height: '100vh',
};

export const POSITION_CONFIG_CONNECTED: PositionConfig = {
    ...POSITION_CONFIG_DEFAULT,
    minWidth: 'origin',
    minHeight: 'origin',
    alignment: {
        origin: {
            horizontal: 'start',
            vertical: 'end',
        },
        target: {
            horizontal: 'start',
            vertical: 'start',
        },
    },
};

export const POSITION_CONFIG_TOOLTIP: PositionConfig = {
    ...POSITION_CONFIG_DEFAULT,
    alignment: {
        origin: {
            horizontal: 'center',
            vertical: 'start',
        },
        target: {
            horizontal: 'center',
            vertical: 'end',
        },
    },
};

export function hasPositionConfigChanged (positionConfig?: Partial<PositionConfig>, other?: Partial<PositionConfig>): boolean {

    if (positionConfig && other) {

        return hasOriginChanged(positionConfig.origin, other.origin)
            || hasAlignmentPairChanged(positionConfig.alignment, other.alignment)
            || hasSizeChanged(positionConfig, other);
    }

    return positionConfig !== other;
}
