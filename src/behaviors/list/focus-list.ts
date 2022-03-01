import { ListBehavior } from './list.js';
import { ListEntryState, ListItem } from './types.js';

export class FocusListBehavior<T extends ListItem = ListItem> extends ListBehavior<T> {

    protected focusing = false;

    protected addListeners (): void {

        if (!this.element) return;

        super.addListeners();

        this.eventManager.listen(this.element, 'focusin', event => this.handleFocus(event as FocusEvent));
    }

    protected markActive (item: T | undefined, interactive = false): void {

        super.markActive(item, interactive);

        item?.setAttribute('tabindex', '0');

        if (interactive) this.setFocus('active');
    }

    protected markInactive (item: T | undefined, interactive = false): void {

        super.markInactive(item, interactive);

        item?.setAttribute('tabindex', '-1');
    }

    protected markSelected (item: T | undefined, interactive?: boolean): void {

        super.markSelected(item, interactive);

        if (interactive) this.setFocus('selected');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected scrollIntoView (item: T | undefined): void {

        // we don't need to manually scroll if focus is set
    }

    protected handleFocus (event: FocusEvent): void {

        // don't handle focus events when `focusing` is true
        // it means focus is being set internally
        if (this.focusing) return;

        const entry = this.entry(event.target as HTMLElement);

        if (!entry || this.disabled(entry) || this.hidden(entry)) return;

        this.setActive(entry, true);
    }

    /**
     * Sets focus to the active or selected item without triggering the focus handler
     *
     * @param state - the state of the entry to focus
     */
    protected setFocus (state: ListEntryState): void {

        this.focusing = true;

        const entry = (state === 'selected')
            ? this.selected
            : this.active;

        entry?.item.focus();

        this.focusing = false;
    }
}
