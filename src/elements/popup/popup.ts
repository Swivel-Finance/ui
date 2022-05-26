import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FocusMonitor, FocusTrap } from '../../behaviors/focus/index.js';
import { OverlayBehavior, OverlayTriggerBehavior } from '../../behaviors/overlay/index.js';
import { Origin, PositionBehavior, Size } from '../../behaviors/position/index.js';
import { IDGenerator } from '../../utils/dom/index.js';
import { EventManager } from '../../utils/events/index.js';
import { DeepPartial } from '../../utils/index.js';
import { PopupConfig, POPUP_CONFIG_DEFAULT } from './config.js';

const ID_GENERATOR = new IDGenerator('ui-popup-');

@customElement('ui-popup')
export class PopupElement extends LitElement {

    protected _config = { ...POPUP_CONFIG_DEFAULT };

    protected eventManager = new EventManager();

    protected focusBehavior?: FocusMonitor;

    protected positionBehavior?: PositionBehavior;

    protected overlayBehavior?: OverlayBehavior;

    protected triggerBehavior?: OverlayTriggerBehavior;

    protected overlayElement?: HTMLElement;

    protected triggerElement?: HTMLElement;

    @property({ attribute: false })
    overlayClasses: string[] = [];

    @property({ attribute: false })
    triggerClasses: string[] = [];

    @property({ attribute: false })
    set config (value: DeepPartial<PopupConfig>) {

        this._config = {
            classes: {
                ...this._config.classes,
                ...value.classes,
            },
            focus: {
                ...this._config.focus,
                ...value.focus,
            },
            position: {
                ...this._config.position,
                ...value.position,
            },
            trigger: {
                ...this._config.trigger,
                ...value.trigger,
            },
            overlay: {
                ...this._config.overlay,
                ...value.overlay,
            },
        };
    }

    get config (): PopupConfig {

        return this._config;
    }

    connectedCallback (): void {

        super.connectedCallback();

        this.id = this.id || ID_GENERATOR.getNext();

        // this is interesting: when a LitElement gets disconnected and reconnected again,
        // it won't reset its `hasUpdated` state and the `firstUpdated` callback won't trigger
        // if we need to delay some handlers until after `firstUpdated` and remove those on
        // `disconnectedCallback`, those handlers won't be bound after a reconnect, so we
        // need to manually check for this here:
        if (this.hasUpdated) {

            this.firstUpdated();
        }
    }

    disconnectedCallback (): void {

        this.removeListeners();
        this.removeAttributes();
        this.detachBehaviors();

        super.disconnectedCallback();
    }

    // proxy API

    async show (interactive = false): Promise<void> {

        await this.overlayBehavior?.show(interactive);
    }

    async hide (interactive = false): Promise<void> {

        await this.overlayBehavior?.hide(interactive);
    }

    async toggle (interactive = false): Promise<void> {

        await this.overlayBehavior?.toggle(interactive);
    }

    async updatePosition (origin?: Origin, size?: Size): Promise<void> {

        await this.overlayBehavior?.update(origin, size);
    }

    focusInitial (): void {

        this.focusBehavior instanceof FocusTrap && this.focusBehavior.focusInitial();
    }

    focusFirst (): void {

        this.focusBehavior instanceof FocusTrap && this.focusBehavior.focusFirst();
    }

    focusLast (): void {

        this.focusBehavior instanceof FocusTrap && this.focusBehavior.focusLast();
    }

    // internal API

    protected firstUpdated (): void {

        this.overlayElement = this.renderRoot.querySelector('[data-part=overlay]') || undefined;
        this.triggerElement = this.renderRoot.querySelector('[data-part=trigger]') || undefined;

        this.attachBehaviors();
        this.addAttributes();
        this.addListeners();
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected addListeners (): void {

        // to be used by sub classes
    }

    protected removeListeners (): void {

        this.eventManager.unlistenAll();
    }

    protected addAttributes (): void {

        this.overlayElement?.classList.add(this.config.classes.overlay, ...this.overlayClasses);
        this.triggerElement?.classList.add(this.config.classes.trigger, ...this.triggerClasses);
    }

    protected removeAttributes (): void {

        this.overlayElement?.classList.remove(this.config.classes.overlay, ...this.overlayClasses);
        this.triggerElement?.classList.remove(this.config.classes.trigger, ...this.triggerClasses);
    }

    protected attachBehaviors (): void {

        this.detachBehaviors();

        this.overlayElement = this.renderRoot.querySelector('[data-part=overlay]') as HTMLElement;
        this.triggerElement = this.renderRoot.querySelector('[data-part=trigger]') as HTMLElement;

        if (!this.focusBehavior) {

            this.focusBehavior = this.config.overlay.focusBehavior ?? new FocusTrap({
                ...this.config.focus,
            });
        }

        if (!this.positionBehavior) {

            this.positionBehavior = this.config.overlay.positionBehavior ?? new PositionBehavior({
                ...this.config.position,
                origin: this.triggerElement,
            });
        }

        if (!this.triggerBehavior) {

            this.triggerBehavior = this.config.overlay.triggerBehavior ?? new OverlayTriggerBehavior({
                ...this.config.trigger,
            });
        }

        if (!this.overlayBehavior) {

            this.overlayBehavior = new OverlayBehavior({
                ...this.config.overlay,
                focusBehavior: this.focusBehavior,
                positionBehavior: this.positionBehavior,
                triggerBehavior: this.triggerBehavior,
            });
        }

        this.overlayBehavior.attach(this.overlayElement);
        this.triggerBehavior.attach(this.triggerElement, this.overlayBehavior);
    }

    protected detachBehaviors (): void {

        this.triggerBehavior?.detach();
        this.overlayBehavior?.detach();
    }
}
