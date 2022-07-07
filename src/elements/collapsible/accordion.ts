import { LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { OpenChangeEvent } from '../../behaviors/overlay/events.js';
import { EventManager } from '../../utils/events/index.js';
import { CollapsibleElement } from './collapsible.js';

@customElement('ui-accordion')
export class AccordionElement extends LitElement {

    protected eventManager = new EventManager();

    protected mutationObserver = new MutationObserver(this.handleMutations.bind(this));

    protected collapsibles = [] as CollapsibleElement[];

    protected active?: CollapsibleElement;

    @property({
        type: Boolean,
    })
    animated = true;

    @property({
        type: Boolean,
    })
    multiple = false;

    connectedCallback (): void {

        super.connectedCallback();

        this.updateCollapsibles();

        this.addListeners();
    }

    disconnectedCallback (): void {

        this.removeListeners();

        super.disconnectedCallback();
    }

    async expandAll (): Promise<void> {

        if (!this.multiple) return;

        await Promise.allSettled(this.collapsibles.map(collapsible => collapsible.toggle(true)));
    }

    async collapseAll (): Promise<void> {

        await Promise.allSettled(this.collapsibles.map(collapsible => collapsible.toggle(false)));
    }

    protected updated (changes: PropertyValues<this>): void {

        if (changes.has('animated')) {

            this.updateCollapsibles();
        }

        if (changes.has('multiple')) {

            this.updateCollapsibles();

            if (!this.multiple) {

                this.collapsibles.forEach(collapsible => this.active !== collapsible && void collapsible.toggle(false));
            }
        }
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected updateCollapsibles (): void {

        this.collapsibles = Array.from(this.querySelectorAll('ui-collapsible'));

        this.collapsibles.forEach(collapsible => collapsible.animated = this.animated);

        if (this.multiple) return;

        this.active = this.collapsibles.find(collapsible => collapsible.expanded);
    }

    protected addListeners (): void {

        this.eventManager.listen(this, 'ui-open-changed', event => this.handleOpenChange(event as OpenChangeEvent<CollapsibleElement>));

        this.mutationObserver.observe(this, { attributes: false, childList: true });
    }

    protected removeListeners (): void {

        this.mutationObserver.disconnect();

        this.eventManager.unlistenAll();
    }

    protected handleOpenChange (event: OpenChangeEvent<CollapsibleElement>): void {

        if (this.multiple) return;

        const expanded = event.detail.open;
        const target = event.detail.target;

        if (!expanded) return;

        if (!this.collapsibles.includes(target)) return;

        if (target !== this.active) {

            if (this.active) {

                void this.active.toggle(false);
            }

            this.active = target;
        }
    }

    protected handleMutations (): void {

        this.updateCollapsibles();
    }
}
