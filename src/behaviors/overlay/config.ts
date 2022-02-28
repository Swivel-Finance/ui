import type { FocusMonitor } from '../focus/index.js';
import type { PositionBehavior } from '../position/index.js';
import { ClassNames, CLASS_MAP } from '../utils/index.js';
import type { OverlayTriggerBehavior } from './index.js';

export interface OverlayConfig {
    classes: Record<ClassNames, string>;
    role: string;
    modal: boolean;
    animated: boolean;
    stacked: boolean;
    backdrop: boolean;
    closeOnEscape: boolean;
    closeOnFocusLoss: boolean;
    closeOnBackdropClick: boolean;
    triggerBehavior?: OverlayTriggerBehavior;
    focusBehavior?: FocusMonitor;
    positionBehavior?: PositionBehavior;
}

export const OVERLAY_CONFIG_DEFAULT: OverlayConfig = {
    classes: CLASS_MAP,
    role: 'dialog',
    modal: true,
    animated: true,
    stacked: true,
    backdrop: false,
    closeOnEscape: true,
    closeOnFocusLoss: true,
    closeOnBackdropClick: true,
};

export const OVERLAY_CONFIG_TOOLTIP: OverlayConfig = {
    ...OVERLAY_CONFIG_DEFAULT,
    role: 'tooltip',
    modal: false,
    stacked: false,
    closeOnEscape: false,
    closeOnFocusLoss: false,
    closeOnBackdropClick: false,
};
