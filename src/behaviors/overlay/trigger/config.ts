export interface OverlayTriggerConfig {
    role: 'alertdialog' | 'dialog' | 'menu' | 'tooltip';
    delay: number;
}

export const OVERLAY_TRIGGER_CONFIG_DEFAULT: OverlayTriggerConfig = {
    role: 'dialog',
    delay: 0,
};
