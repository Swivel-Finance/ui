import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FocusMonitor, FocusTrap } from '../../behaviors/focus/index.js';
import { OpenChangeEvent, OverlayBehavior, OverlayConfig, OverlayTriggerBehavior } from '../../behaviors/overlay/index.js';
import { PositionBehavior } from '../../behaviors/position/index.js';
import { IDGenerator, setAttribute } from '../../utils/dom/index.js';
import { EventManager, MappedAddEventListener, MappedRemoveEventListener } from '../../utils/events/index.js';
import { POSITION_CONFIG_CENTERED } from '../constants/index.js';
import { DIALOG_CLASSES, DIALOG_CONFIG_DEFAULT } from './config.js';
import { DialogElementEventMap, DialogResultEvent } from './events.js';

const ID_GENERATOR = new IDGenerator('ui-dialog-');

@customElement('ui-dialog')
export class DialogElement<T = unknown> extends LitElement {

    protected _config: OverlayConfig = { ...DIALOG_CONFIG_DEFAULT };

    protected eventManager = new EventManager();

    protected overlayBehavior?: OverlayBehavior;

    protected triggerBehavior?: OverlayTriggerBehavior;

    protected focusBehavior?: FocusMonitor;

    protected positionBehavior?: PositionBehavior;

    protected closeAction?: 'dismiss' | 'cancel' | 'confirm';

    @property({ attribute: false })
    set config (value: Partial<OverlayConfig>) {

        this._config = { ...this._config, ...value };

        if (this.isConnected && this.hasUpdated) {

            this.attachBehaviors();
        }
    }

    get config (): OverlayConfig {

        return this._config;
    }

    classes: string[] = [];

    hidden = true;

    @property()
    trigger?: string;

    @property()
    result?: T;

    constructor () {

        super();

        this.id = this.id || ID_GENERATOR.getNext();
    }

    connectedCallback (): void {

        if (this.overlayBehavior?.moving) return;

        super.connectedCallback();

        this.addListeners();
        this.attachBehaviors();
    }

    disconnectedCallback (): void {

        if (this.overlayBehavior?.moving) return;

        this.detachBehaviors();
        this.removeListeners();

        super.disconnectedCallback();
    }

    async show (interactive?: boolean): Promise<void> {

        await this.overlayBehavior?.show(interactive);
    }

    async hide (interactive?: boolean): Promise<void> {

        await this.overlayBehavior?.hide(interactive);
    }

    async confirm (interactive?: boolean): Promise<void> {

        this.closeAction = 'confirm';

        await this.hide(interactive);
    }

    async cancel (interactive?: boolean): Promise<void> {

        this.closeAction = 'cancel';

        await this.hide(interactive);
    }

    async dismiss (interactive?: boolean): Promise<void> {

        this.closeAction = 'dismiss';

        await this.hide(interactive);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected firstUpdated (): void {

        // update the dialog classes
        this.classList.add(DIALOG_CLASSES.DIALOG, ...this.classes);

        // label the dialog when the title is present
        const titleId = `${ this.id }-title`;

        if (this.querySelector(`#${ titleId }`)) {

            setAttribute(this, 'aria-labelledby', titleId);
        }

        // auto-bind basic event listeners for elements with the `data-command` attribute
        const dismiss = this.querySelectorAll<HTMLElement>('[data-command=dismiss]');
        const cancel = this.querySelectorAll<HTMLElement>('[data-command=cancel]');
        const confirm = this.querySelectorAll<HTMLElement>('[data-command=confirm]');

        dismiss.forEach(element => this.eventManager.listen(element, 'click', () => void this.dismiss(true)));
        cancel.forEach(element => this.eventManager.listen(element, 'click', () => void this.cancel(true)));
        confirm.forEach(element => this.eventManager.listen(element, 'click', () => void this.confirm(true)));
    }

    protected addListeners (): void {

        this.eventManager.listen(this, 'ui-open-changed', event => this.handleOpenChange(event as OpenChangeEvent));
    }

    protected removeListeners (): void {

        this.eventManager.unlistenAll();
    }

    protected attachBehaviors (): void {

        this.triggerBehavior?.detach();
        this.overlayBehavior?.detach();

        const triggerElement = this.trigger
            ? document.getElementById(this.trigger) || undefined
            : document.querySelector<HTMLElement>(`[aria-controls=${ this.id }]`) || undefined;

        this.triggerBehavior = this.config.triggerBehavior ?? (triggerElement && new OverlayTriggerBehavior());

        this.focusBehavior = this.config.focusBehavior ?? new FocusTrap();

        this.positionBehavior = this.config.positionBehavior ?? new PositionBehavior(POSITION_CONFIG_CENTERED);

        this.overlayBehavior = new OverlayBehavior({
            ...this.config,
            triggerBehavior: this.triggerBehavior,
            focusBehavior: this.focusBehavior,
            positionBehavior: this.positionBehavior,
        });

        this.overlayBehavior.attach(this);

        if (triggerElement && this.triggerBehavior) {

            this.triggerBehavior.attach(triggerElement, this.overlayBehavior);
        }
    }

    protected detachBehaviors (): void {

        this.triggerBehavior?.detach();
        this.overlayBehavior?.detach();
    }

    protected dispatchResult (result?: T): void {

        this.eventManager.dispatch(this, new DialogResultEvent<T>({
            target: this,
            result,
        }));
    }

    /**
     * Dispatch a {@link DialogResultEvent} when the dialog closes.
     *
     * @remarks
     * A dialog can close for various reasons:
     * - a concrete UI interaction like `confirm`, `cancel` or `dismiss`
     * - an inherited behavior from the underlying {@link OverlayBehavior},
     *   e.g. pressing ESC, clicking the backdrop, losing focus
     *
     * To be compatible with the {@link OverlayService}'s `prompt` method,
     * we want to ensure to always emit a {@link DialogResultEvent}.
     */
    protected handleOpenChange (event: OpenChangeEvent): void {

        if (event.detail.target !== this) return;

        if (event.detail.open) {

            // reset the closeAction when the dialog is opened
            this.closeAction = undefined;

        } else {

            // for non-confirmative actions, we want to dispatch `undefined` as result
            this.dispatchResult(this.closeAction === 'confirm' ? this.result : undefined);
        }
    }
}

export interface DialogElement<T = unknown> {
    addEventListener: MappedAddEventListener<DialogElement<T>, DialogElementEventMap<T>>;
    removeEventListener: MappedRemoveEventListener<DialogElement<T>, DialogElementEventMap<T>>;
}
