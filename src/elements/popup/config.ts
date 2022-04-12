import { FocusTrapConfig, FOCUS_TRAP_CONFIG_DEFAULT } from '../../behaviors/focus/index.js';
import { OverlayConfig, OverlayTriggerConfig, OVERLAY_CONFIG_DEFAULT, OVERLAY_TRIGGER_CONFIG_DEFAULT } from '../../behaviors/overlay/index.js';
import { PositionConfig } from '../../behaviors/position/index.js';
import { POSITION_CONFIG_CONNECTED } from '../constants/index.js';

export interface PopupConfig {
    classes: {
        overlay: string;
        trigger: string;
    }
    focus: FocusTrapConfig;
    position: PositionConfig;
    trigger: OverlayTriggerConfig;
    overlay: OverlayConfig;
}

export const POPUP_CONFIG_DEFAULT: PopupConfig = {
    classes: {
        overlay: 'ui-popup-overlay',
        trigger: 'ui-popup-trigger',
    },
    focus: {
        ...FOCUS_TRAP_CONFIG_DEFAULT,
        trapFocus: false,
    },
    position: {
        ...POSITION_CONFIG_CONNECTED,
    },
    trigger: {
        ...OVERLAY_TRIGGER_CONFIG_DEFAULT,
    },
    overlay: {
        ...OVERLAY_CONFIG_DEFAULT,
        backdrop: false,
        modal: false,
    },
};

export const POPUP_CONFIG_MENU: PopupConfig = {
    ...POPUP_CONFIG_DEFAULT,
    trigger: {
        ...POPUP_CONFIG_DEFAULT.trigger,
        role: 'menu',
    },
    overlay: {
        ...POPUP_CONFIG_DEFAULT.overlay,
        role: 'menu',
    },
};
