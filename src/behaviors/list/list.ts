import { AttributeManager, IDGenerator, setAttribute } from '../../utils/dom/index.js';
import { cancel, EventManager } from '../../utils/events/index.js';
import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER, SPACE } from '../../utils/index.js';
import { Behavior } from '../behavior';
import { ListConfig, LIST_CONFIG_DEFAULT } from './config.js';
import { ActivateEvent, SelectEvent } from './events.js';
import { ListEntry, ListEntryLocator, ListEntryState, ListItem } from './types.js';

const SELECTION_ATTRIBUTE_MAP = {
    'checkbox': 'aria-checked',
    'radio': 'aria-checked',
    'menuitem': 'aria-selected',
    'menuitemcheckbox': 'aria-checked',
    'menuitemradio': 'aria-checked',
    'option': 'aria-selected',
    'tab': 'aria-selected',
    'default': 'aria-selected',
};

const selectionAttribute = (item: HTMLElement | undefined): string => {

    return SELECTION_ATTRIBUTE_MAP[item?.getAttribute('role') as keyof typeof SELECTION_ATTRIBUTE_MAP || 'default'];
};

const LIST_ID_GENERATOR = new IDGenerator('ui-list-');
const ITEM_ID_GENERATOR = new IDGenerator('ui-list-item-');

export class ListBehavior<T extends ListItem = ListItem> extends Behavior {

    protected config: ListConfig;

    protected attributeManager?: AttributeManager;

    protected eventManager = new EventManager();

    protected id = LIST_ID_GENERATOR.getNext();

    protected active?: ListEntry<T>;

    protected selected?: ListEntry<T>;

    items: T[] = [];

    get activeEntry (): ListEntry<T> | undefined {

        return this.active;
    }

    get selectedEntry (): ListEntry<T> | undefined {

        return this.selected;
    }

    constructor (config?: Partial<ListConfig>) {

        super();

        this.config = { ...LIST_CONFIG_DEFAULT, ...config };
    }

    /**
     * @param list - the list element root
     * @param items - the list item elements
     */
    attach (list: HTMLElement, items: NodeListOf<T> | T[]): boolean {

        if (!super.attach(list)) return false;

        this.attributeManager = new AttributeManager(list);
        this.items = Array.from(items);

        this.addAttributes();
        this.addListeners();

        // ensure there's an active list item to start with
        if (!this.active) {

            this.setActive('first');
        }

        return true;
    }

    detach (): boolean {

        if (!this.hasAttached) return false;

        this.removeListeners();
        this.removeAttributes();

        this.selected = undefined;
        this.active = undefined;
        this.items = [];

        return super.detach();
    }

    setActive (item: number | T | ListEntry<T> | ListEntryLocator | undefined, interactive = false): void {

        const previous = this.active;
        const entry = (typeof item === 'string')
            ? this.find('active', item)
            : this.entry(item);

        this.active = entry && !entry.item.disabled && !entry.item.hidden
            ? entry
            : this.active && !this.active.item.disabled && !this.active.item.hidden
                ? this.active
                : undefined;

        this.markInactive(previous?.item, interactive);
        this.markActive(this.active?.item, interactive);
        this.scrollIntoView(this.active?.item);

        if (interactive) this.notifyActivation(previous);
    }

    setSelected (item: number | T | ListEntry<T> | ListEntryLocator | undefined, interactive = false): void {

        const previous = this.selected;
        const entry = (typeof item === 'string')
            ? this.find('active', item)
            : this.entry(item);

        this.selected = entry && !entry.item.disabled && !entry.item.hidden
            ? entry
            : this.selected && !this.selected.item.disabled && !this.selected.item.hidden
                ? this.selected
                : undefined;

        this.markUnselected(previous?.item, interactive);
        this.markSelected(this.selected?.item, interactive);

        if (interactive) this.notifySelection(previous);
    }

    scrollTo (item: number | T | ListEntry<T> | ListEntryLocator | ListEntryState | undefined): void {

        const entry = (typeof item === 'string')
            ? (item === 'active' || item === 'selected')
                ? this.find(item, 'current')
                : this.find('active', item)
            : this.entry(item);

        this.scrollIntoView(entry?.item);
    }

    protected addAttributes (): void {

        if (!this.element) return;

        this.attributeManager?.set('role', this.element.getAttribute('role') || this.config.role);
        this.attributeManager?.set('tabindex', this.element.getAttribute('tabindex') ?? -1);
        this.attributeManager?.set('id', this.element.id || this.id);
        this.attributeManager?.set('aria-orientation', this.config.orientation);

        this.element.classList.add(this.config.classes[this.config.orientation || 'vertical']);

        // we won't restore these to keep the item ids between attached/detached states
        this.items.forEach(item => {

            setAttribute(item, 'role', item.getAttribute('role') || this.config.itemRole);
            setAttribute(item, 'id', item.id || ITEM_ID_GENERATOR.getNext());

            // handle list items marked as selected
            if (item.getAttribute(selectionAttribute(item)) === 'true') {

                this.setActive(item);
                this.setSelected(item);

            } else {

                this.markInactive(item);
                this.markUnselected(item);
            }
        });
    }

    protected removeAttributes (): void {

        this.attributeManager?.restoreAll();

        this.element?.classList.remove(this.config.classes[this.config.orientation || 'vertical']);
    }

    protected addListeners (): void {

        if (!this.element) return;

        this.eventManager.listen(this.element, 'click', event => this.handleClick(event as MouseEvent));
        this.eventManager.listen(this.element, 'mousedown', event => this.handleMousedown(event as MouseEvent));
        this.eventManager.listen(this.element, 'keydown', event => this.handleKeydown(event as KeyboardEvent));
    }

    protected removeListeners (): void {

        this.eventManager.unlistenAll();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected markActive (item: T | undefined, interactive = false): void {

        item?.classList.add(this.config.classes.active);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected markInactive (item: T | undefined, interactive = false): void {

        item?.classList.remove(this.config.classes.active);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected markSelected (item: T | undefined, interactive = false): void {

        item?.setAttribute(selectionAttribute(item), 'true');
        item?.classList.add(this.config.classes.selected);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected markUnselected (item: T | undefined, interactive = false): void {

        item?.setAttribute(selectionAttribute(item), 'false');
        item?.classList.remove(this.config.classes.selected);
    }

    protected scrollIntoView (item: T | undefined): void {

        if (!this.element) return;

        const listRect = this.element.getBoundingClientRect();
        const itemRect = item?.getBoundingClientRect() ?? listRect;

        if (itemRect.bottom > listRect.bottom) {

            this.element.scrollTop = this.element.scrollTop + (itemRect.bottom - listRect.bottom);
        }
        if (itemRect.top < listRect.top) {

            this.element.scrollTop = this.element.scrollTop - (listRect.top - itemRect.top);
        }
    }

    protected handleKeydown (event: KeyboardEvent): void {

        switch (event.key) {

            case ARROW_UP:

                if (this.config.orientation === 'horizontal') break;
                cancel(event);
                this.setActive('previous', true);
                break;

            case ARROW_LEFT:

                if (this.config.orientation === 'vertical') break;
                cancel(event);
                this.setActive('previous', true);
                break;

            case ARROW_DOWN:

                if (this.config.orientation === 'horizontal') break;
                cancel(event);
                this.setActive('next', true);
                break;

            case ARROW_RIGHT:

                if (this.config.orientation === 'vertical') break;
                cancel(event);
                this.setActive('next', true);
                break;

            case ENTER:
            case SPACE:

                cancel(event);
                this.setSelected(this.active, true);
                break;
        }
    }

    protected handleMousedown (event: MouseEvent): void {

        const entry = this.entry(event.target as HTMLElement);

        if (entry && !this.disabled(entry) && !this.hidden(entry)) {

            this.setActive(entry, true);
        }
    }

    protected handleClick (event: MouseEvent): void {

        const entry = this.entry(event.target as HTMLElement);

        if (entry && !this.disabled(entry) && !this.hidden(entry)) {

            this.setSelected(entry, true);
        }
    }

    /**
     * Dispatch an {@link ActivateEvent}
     *
     * @param previousEntry - the previous active list entry
     */
    protected notifyActivation (previousEntry?: ListEntry<T>): void {

        if (!this.element) return;

        this.dispatch(new ActivateEvent({
            target: this.element,
            previous: previousEntry,
            current: this.active,
            change: previousEntry?.index !== this.active?.index,
        }));
    }

    /**
     * Dispatch a {@link SelectEvent}
     *
     * @param previousEnty - the previous selected list entry
     */
    protected notifySelection (previousEnty?: ListEntry<T>): void {

        if (!this.element) return;

        this.dispatch(new SelectEvent({
            target: this.element,
            previous: previousEnty,
            current: this.selected,
            change: previousEnty?.index !== this.selected?.index,
        }));
    }

    /**
     * Resolves a {@link ListEntry} for a provided list item
     *
     * @remarks
     * If an HTMLElement is provided as list item this method will resolve an entry that is the item
     * or a parent of the item (useful for resolving event targets).
     *
     * @param i - the item to resolve an entry for
     */
    protected entry (i?: number | HTMLElement | ListEntry<T>): ListEntry<T> | undefined {

        if (i === undefined) return undefined;

        const index = (typeof i === 'number')
            ? i
            : (i instanceof HTMLElement)
                ? this.items.findIndex(item => item.contains(i))
                : i.index;

        const item = this.items[index];

        return item ? { item, index } : undefined;
    }

    /**
     * Finds a {@link ListEntry} relative to an index or the current active/selected entry
     *
     * @param s - the list entry state
     * @param l - the list entry locator
     * @param i - optional index from where to start
     */
    protected find (s: ListEntryState, l: ListEntryLocator, i?: number): ListEntry<T> | undefined {

        const current = (s === 'active')
            ? this.active
            : this.selected;

        let from: number,
            next: ListEntry<T> | undefined,
            previous: ListEntry<T> | undefined;

        switch (l) {

            case 'current':

                return current;

            case 'next':

                from = i ?? current?.index ?? -1;
                next = this.entry((from = this.next(from)));

                while (this.disabled(next) || this.hidden(next)) next = this.entry((from = this.next(from)));

                return next ?? current;

            case 'previous':

                from = i ?? current?.index ?? 0;
                previous = this.entry((from = this.previous(from)));

                while (this.disabled(previous) || this.hidden(previous)) previous = this.entry((from = this.previous(from)));

                return previous ?? current;

            case 'first':

                return this.find(s, 'next', -1);

            case 'last':

                return this.find(s, 'previous', this.items.length);
        }
    }

    /**
     * Checks if a {@link ListEntry} is disabled
     *
     * @param entry - the list entry to check
     * @returns `true` if the list entry exists and is disabled, `false` otherwise
     */
    protected disabled (entry: ListEntry<T> | undefined): boolean {

        return entry?.item.disabled || entry?.item.getAttribute('aria-disabled') === 'true';
    }

    /**
     * Checks if a {@link ListEntry} is hidden
     *
     * @param entry - the list entry to check
     * @returns `true` if the list entry exists and is hidden, `false` otherwise
     */
    protected hidden (entry: ListEntry<T> | undefined): boolean {

        return entry?.item.hidden || entry?.item.getAttribute('aria-hidden') === 'true';
    }

    /**
     * Calculate the next item index based on the {@link ListConfig.wrap} setting.
     *
     * @param current - the current list item index
     * @returns - the next index or the first index if `current` is the last index
     */
    protected next (current: number): number {

        return (this.config.wrap && current >= this.items.length - 1)
            ? 0
            : current + 1;
    }

    /**
     * Calculate the previous item index based on the {@link ListConfig.wrap} setting.
     *
     * @param current - the current list item index
     * @returns - the previous index or the last index if `current` is the first index
     */
    protected previous (current: number): number {

        return (this.config.wrap && current <= 0)
            ? this.items.length - 1
            : current - 1;
    }
}
