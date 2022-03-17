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

        await toggleVisibility(this, true, this.config.animated, this.config.classes, this.config.animationOptions);
    }

    async hide (): Promise<void> {

        await toggleVisibility(this, false, this.config.animated, this.config.classes, this.config.animationOptions);
    }

    protected initialize (): void {

        if (this.initialized) return;

        this.setAttribute('hidden', '');
        this.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;');
        this.classList.add(this.config.classes.invisible);

        this.initialized = true;
    }
}

customElements.define('ui-backdrop', BackdropElement);
