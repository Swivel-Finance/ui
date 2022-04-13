import { toggleVisibility } from '../../utils/index.js';
import { BackdropConfig, BACKDROP_CONFIG_DEFAULT } from './config.js';

export class BackdropElement extends HTMLElement {

    protected config: BackdropConfig;

    protected initialized = false;

    constructor (config?: BackdropConfig) {

        super();

        this.config = { ...BACKDROP_CONFIG_DEFAULT, ...config };
    }

    connectedCallback (): void {

        this.initialize();
    }

    async show (): Promise<void> {

        await toggleVisibility(this, true, undefined, this.config.animated, this.config.classes, this.config.animationOptions);
    }

    async hide (): Promise<void> {

        await toggleVisibility(this, false, undefined, this.config.animated, this.config.classes, this.config.animationOptions);
    }

    protected initialize (): void {

        if (this.initialized) return;

        this.setAttribute('hidden', '');
        this.classList.add(this.config.classes.invisible);

        this.initialized = true;
    }
}

customElements.define('ui-backdrop', BackdropElement);
