import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FocusChangeEvent, FocusMonitor } from '../../behaviors/focus/index.js';
import { FocusListBehavior, isSelected, ListBehavior, ListConfig, LIST_CONFIG_DEFAULT, SelectEvent } from '../../behaviors/list/index.js';
import { animationtask, TaskReference } from '../../utils/async/index.js';
import { EventManager } from '../../utils/events/index.js';
import { MixinInput } from '../input/index.js';
import { ListItemElement } from '../listitem/index.js';

@customElement('ui-listbox')
export class ListBoxElement extends MixinInput(LitElement) {

    protected eventManager = new EventManager();

    protected mutationObserver = new MutationObserver(this.handleMutations.bind(this));

    protected updateTask?: TaskReference<void>;

    protected focused = false;

    protected focusMonitor = new FocusMonitor();

    protected listConfig: Partial<ListConfig> = {};

    protected listBehavior?: ListBehavior<ListItemElement>;

    @property()
    set config (value: Partial<ListConfig>) {

        if (value === this.config) return;

        this.listConfig = value;

        if (this.hasUpdated) this.attachBehaviors();
    }

    get config (): Partial<ListConfig> {

        return this.listConfig;
    }

    @property({
        attribute: 'no-focus',
        type: Boolean,
    })
    noFocus = false;

    connectedCallback (): void {

        super.connectedCallback();

        this.attachBehaviors();
    }

    disconnectedCallback (): void {

        this.detachBehaviors();

        super.disconnectedCallback();
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected attachBehaviors (): void {

        // backup the list behavior state we want to restore if a list behavior is attached
        const active = this.listBehavior?.activeEntry?.index;
        const selected = this.listBehavior?.selectedEntry?.index;

        // detach the current list behavior
        this.detachBehaviors();

        // re-attach the focus monitor
        this.focusMonitor.attach(this);

        // re-instantiate the list behavior
        this.listBehavior = this.noFocus
            ? new ListBehavior<ListItemElement>({ ...LIST_CONFIG_DEFAULT, ...this.config })
            : new FocusListBehavior<ListItemElement>({ ...LIST_CONFIG_DEFAULT, ...this.config });

        // re-query the list items and re-attach the list behavior
        this.listBehavior.attach(this, this.getItems());

        // restore the list behavior state
        this.restoreState(active, selected);

        // update the listbox value
        this.value = this.getValue(this.listBehavior.selectedEntry?.item);

        // re-attach listeners
        this.addListeners();
    }

    protected detachBehaviors (): void {

        this.removeListeners();

        this.focusMonitor.detach();
        this.listBehavior?.detach();
    }

    protected addListeners (): void {

        this.eventManager.listen(this, 'ui-select-item', event => this.handleSelection(event as SelectEvent));
        this.eventManager.listen(this, 'ui-focus-changed', event => this.handleFocusChange(event as FocusChangeEvent));

        this.mutationObserver.observe(this, { attributeFilter: ['aria-selected', 'aria-checked'], childList: true, subtree: true });
    }

    protected removeListeners (): void {

        this.mutationObserver.disconnect();

        this.eventManager.unlistenAll();
    }

    /**
     * Restores the state of the list box after a list item of config update.
     *
     * @param active - the previously active item index
     * @param selected - the previously selected item index
     */
    protected restoreState (active?: number, selected?: number): void {

        if (!this.listBehavior) return;

        // if the selected item was the active item, we want to restore that
        const selectedIsActive = active === selected;

        // only retsore the selected item, if none was set during the item update
        if (!this.listBehavior.selectedEntry) {

            this.listBehavior.setSelected(selected);
        }

        // update the selected and active indizes based on the restored selected state
        selected = this.listBehavior.selectedEntry?.index;
        active = selectedIsActive ? selected : active;

        // activate the correct item, restoring focus if the list box was focused before the update
        this.listBehavior.setActive(active ?? selected ?? 'first', this.focused);
    }

    protected handleSelection (event: SelectEvent): void {

        if (event.detail.target !== this || !event.detail.change) return;

        this.value = this.getValue(event.detail.current?.item as ListItemElement);

        this.dispatchValueChange();
    }

    protected handleMutations (mutations: MutationRecord[]): void {

        const update = mutations.some(record => {

            const element = record.target instanceof ListItemElement ? record.target : undefined;
            const updated = record.type === 'attributes' && !!element
                && (isSelected(element) && this.listBehavior?.selectedEntry?.item !== element
                    || !isSelected(element) && this.listBehavior?.selectedEntry?.item === element);

            const added = Array.from(record.addedNodes);
            const removed = Array.from(record.removedNodes);

            return updated
                || added.some(node => node instanceof ListItemElement)
                || removed.some(node => node instanceof ListItemElement);
        });

        if (update && !this.updateTask) {

            this.updateTask = animationtask(() => {

                this.updateTask = undefined;

                this.attachBehaviors();
            });
        }
    }

    protected handleFocusChange (event: FocusChangeEvent): void {

        this.focused = event.detail.hasFocus;
    }

    protected getItems (): NodeListOf<ListItemElement> {

        return this.renderRoot.querySelectorAll('ui-listitem');
    }

    protected getValue (item?: ListItemElement): unknown {

        return item
            ? item.value ?? item.dataset.value
            : undefined;
    }
}
