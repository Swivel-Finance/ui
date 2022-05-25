import { OverlayConfig, OVERLAY_CONFIG_DEFAULT } from '../../behaviors/overlay/index.js';

export const DIALOG_CONFIG_MODAL: OverlayConfig = {
    ...OVERLAY_CONFIG_DEFAULT,
    role: 'dialog',
    modal: true,
    animated: true,
    stacked: true,
    backdrop: true,
    closeOnEscape: true,
    closeOnFocusLoss: false,
    closeOnBackdropClick: false,
};

export const DIALOG_CONFIG_NON_MODAL: OverlayConfig = {
    ...DIALOG_CONFIG_MODAL,
    modal: false,
    closeOnFocusLoss: true,
    closeOnBackdropClick: true,
};

export const DIALOG_CONFIG_DEFAULT: OverlayConfig = {
    ...DIALOG_CONFIG_MODAL,
};

export const DIALOG_CLASSES = {
    DIALOG: 'ui-dialog',
    ANNOUNCEMENT: 'ui-announcement-dialog',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
};
