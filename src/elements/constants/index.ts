import {
    Offset,
    PositionConfig,
    POSITION_CONFIG_CENTERED as POSITION_CONFIG_CENTERED_BASE,
    POSITION_CONFIG_CONNECTED as POSITION_CONFIG_CONNECTED_BASE,
    POSITION_CONFIG_DEFAULT as POSITION_CONFIG_DEFAULT_BASE,
    POSITION_CONFIG_FULLSCREEN as POSITION_CONFIG_FULLSCREEN_BASE,
    POSITION_CONFIG_TOOLTIP as POSITION_CONFIG_TOOLTIP_BASE,
} from '../../behaviors/position/index.js';

export const OVERLAY_SAFE_ZONE: Partial<Offset> = {
    horizontal: 'var(--line-height, 1rem)',
    vertical: 'var(--line-height, 1rem)',
};

export const TOOLTIP_OFFSET: Partial<Offset> = {
    vertical: 'var(--line-height, 1rem)',
};

export const POSITION_CONFIG_DEFAULT: PositionConfig = {
    ...POSITION_CONFIG_DEFAULT_BASE,
    safeZone: { ...OVERLAY_SAFE_ZONE },
};

export const POSITION_CONFIG_CENTERED: PositionConfig = {
    ...POSITION_CONFIG_CENTERED_BASE,
    safeZone: { ...OVERLAY_SAFE_ZONE },
};

export const POSITION_CONFIG_CONNECTED: PositionConfig = {
    ...POSITION_CONFIG_CONNECTED_BASE,
    safeZone: { ...OVERLAY_SAFE_ZONE },
};

export const POSITION_CONFIG_FULLSCREEN: PositionConfig = {
    ...POSITION_CONFIG_FULLSCREEN_BASE,
    safeZone: { ...OVERLAY_SAFE_ZONE },
};

export const POSITION_CONFIG_TOOLTIP: PositionConfig = {
    ...POSITION_CONFIG_TOOLTIP_BASE,
    alignment: {
        ...POSITION_CONFIG_TOOLTIP_BASE.alignment,
        offset: { ...TOOLTIP_OFFSET },
    },
    safeZone: { ...OVERLAY_SAFE_ZONE },
};
