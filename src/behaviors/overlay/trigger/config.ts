export interface OverlayTriggerConfig {
    role: string;
    delay: number;
}

export const OVERLAY_TRIGGER_CONFIG_DEFAULT: OverlayTriggerConfig = {
    role: 'dialog',
    delay: 0,
};
