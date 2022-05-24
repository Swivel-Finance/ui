import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FocusChangeEvent, FocusMonitor } from '../../behaviors/focus/index.js';
import { FocusListBehavior, ListBehavior, ListConfig, ListEntry, ListEntryLocator, ListUpdateEvent, LIST_CONFIG_DEFAULT, SelectEvent } from '../../behaviors/list/index.js';
import { animationtask, cancelTask, TaskReference } from '../../utils/async/index.js';
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

    /**
     * Determines if the listbox uses a {@link ListBehavior} or {@link FocusListBehavior}.
     */
    @property({
        attribute: 'no-focus',
        type: Boolean,
    })
    noFocus = false;

    /**
     * Proxy for the {@link ListBehavior}'s activeEntry getter.
     */
    get activeEntry (): ListEntry<ListItemElement> | undefined {

        return this.listBehavior?.activeEntry;
    }

    /**
     * Proxy for the {@link ListBehavior}'s selectedEntry getter.
     */
    get selectedEntry (): ListEntry<ListItemElement> | undefined {

        return this.listBehavior?.selectedEntry;
    }

    connectedCallback (): void {

        super.connectedCallback();

        this.attachBehaviors();
    }

    disconnectedCallback (): void {

        this.detachBehaviors();

        super.disconnectedCallback();
    }

    /**
     * Proxy for the {@link ListBehavior}'s setActive method.
     */
    setActive (item: number | ListItemElement | ListEntry<ListItemElement> | ListEntryLocator | undefined, interactive = false): void {

        this.listBehavior?.setActive(item, interactive);
    }

    /**
     * Proxy for the {@link ListBehavior}'s setSelected method.
     */
    setSelected (item: number | ListItemElement | ListEntry<ListItemElement> | ListEntryLocator | undefined, interactive = false): void {

        this.listBehavior?.setSelected(item, interactive);
    }

    /**
     * Proxy for the {@link ListBehavior}'s reset method.
     */
    reset (interactive = false): void {

        this.value = undefined;

        this.listBehavior?.reset(interactive);

        if (interactive) this.dispatchValueChange();
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected attachBehaviors (): void {

        // detach the current behaviors
        this.detachBehaviors();

        // re-attach the focus monitor
        this.focusMonitor.attach(this);

        // re-instantiate the list behavior
        this.listBehavior = this.noFocus
            ? new ListBehavior<ListItemElement>({ ...LIST_CONFIG_DEFAULT, ...this.config })
            : new FocusListBehavior<ListItemElement>({ ...LIST_CONFIG_DEFAULT, ...this.config });

        // re-query the list items and re-attach the list behavior
        this.listBehavior.attach(this, this.getItems());

        // update the listbox value
        this.value = this.getValue(this.listBehavior.selectedEntry?.item);

        // re-attach listeners
        this.addListeners();
    }

    protected detachBehaviors (): void {

        this.updateTask && cancelTask(this.updateTask);

        this.removeListeners();

        this.focusMonitor.detach();
        this.listBehavior?.detach();
    }

    protected addListeners (): void {

        this.eventManager.listen(this, 'ui-select-item', event => this.handleSelection(event as SelectEvent));
        this.eventManager.listen(this, 'ui-list-updated', event => this.handleUpdate(event as ListUpdateEvent));
        this.eventManager.listen(this, 'ui-focus-changed', event => this.handleFocusChange(event as FocusChangeEvent));

        this.mutationObserver.observe(this, { attributes: false, childList: true });
    }

    protected removeListeners (): void {

        this.mutationObserver.disconnect();

        this.eventManager.unlistenAll();
    }

    protected handleFocusChange (event: FocusChangeEvent): void {

        this.focused = event.detail.hasFocus;
    }

    protected handleSelection (event: SelectEvent): void {

        if (event.detail.target !== this || !event.detail.change) return;

        this.value = this.getValue(event.detail.current?.item as ListItemElement);

        this.dispatchValueChange();
    }

    /**
     * Handle list behavior updates
     *
     * @remarks
     * The list behavior fires update events when a list item's selected state changes through
     * outside intervention or when the list items are updated. Both of these things can happen
     * during template re-rendering and require a state update. We don't dispatch ValueChange
     * events in these cases, as changes are not made through user interactions.
     */
    protected handleUpdate (event: ListUpdateEvent): void {

        if (event.detail.target !== this || !event.detail.change) return;

        this.value = this.getValue(event.detail.selected?.item as ListItemElement);
    }

    /**
     * Handle DOM mutations
     *
     * @remarks
     * We only observe `ui-listitem` elements being added or removed, attribute changes
     * to the list items are observed by the list behavior itself. The `ui-listbox`
     * element is responsible for managing its children and update the list behavior
     * when items change. If that results in a state change in the list behavior, we
     * capture it in the `handleUpdate` method.
     */
    protected handleMutations (mutations: MutationRecord[]): void {

        const focused = this.focused;

        const update = mutations.some(record => {

            const added = Array.from(record.addedNodes);
            const removed = Array.from(record.removedNodes);

            return added.some(node => node instanceof ListItemElement)
                || removed.some(node => node instanceof ListItemElement);
        });

        if (update && !this.updateTask) {

            // batch mutation callbacks into an animation frame callback
            this.updateTask = animationtask(() => {

                this.updateTask = undefined;

                this.listBehavior?.update(this.getItems());

                this.listBehavior?.setActive(this.listBehavior.activeEntry, focused);
            });
        }
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
