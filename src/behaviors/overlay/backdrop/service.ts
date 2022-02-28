import { BackdropElement } from './backdrop.js';
import { BackdropConfig, BACKDROP_CONFIG_DEFAULT } from './config.js';

export class OverlayBackdrop {

    protected overlays = new Set<HTMLElement>();

    protected root = document.body;

    protected element: BackdropElement;

    protected config: BackdropConfig;

    constructor (config?: BackdropConfig) {

        this.config = { ...BACKDROP_CONFIG_DEFAULT, ...config };

        this.element = new BackdropElement(this.config);
    }

    async show (overlay: HTMLElement): Promise<void> {

        this.overlays.add(overlay);

        this.root.insertBefore(this.element, overlay);

        await this.element.show();
    }

    async hide (overlay: HTMLElement): Promise<void> {

        let previous: HTMLElement | undefined = undefined;

        for (const current of this.overlays) {

            if (current === overlay) break;

            previous = current;
        }

        this.overlays.delete(overlay);

        if (previous) {

            this.root.insertBefore(this.element, previous);

        } else {

            await this.element.hide();
        }
    }
}
