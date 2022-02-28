import { PositionConfig, POSITION_CONFIG_DEFAULT } from './config.js';
import { PositionBehavior } from './position.js';
import { PositionStyles, style } from './utils/index.js';

export const POSITION_CONFIG_CENTERED: PositionConfig = {
    ...POSITION_CONFIG_DEFAULT,
};

export class CenteredPositionBehavior extends PositionBehavior {

    constructor (config?: Partial<PositionConfig>) {

        super({ ...POSITION_CONFIG_CENTERED, ...config });
    }

    protected addListeners () {

        // we don't need any listeners for this responsive position behavior
    }

    protected fitPosition (): Partial<PositionStyles> {

        return {
            maxHeight: style(window.innerHeight - this.zone.vertical * 2),
            maxWidth: style(window.innerWidth - this.zone.horizontal * 2),
        };
    }

    protected updateStyles (styles: Partial<PositionStyles> = {}) {

        if (!this.element || !this.hasAttached) return;

        styles.position = 'absolute';
        styles.top = '0';
        styles.left = '0';
        styles.right = 'unset';
        styles.bottom = 'unset';

        super.updateStyles(styles);

        this.element.style.transform = 'translate(calc(50vw - 50%), calc(50vh - 50%))';
    }
}
