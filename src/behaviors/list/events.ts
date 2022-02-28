import { ElementEvent, ElementEventDetail } from '../../utils/events/index.js';
import { ListItem, ListEntry } from './types.js';

export interface ListItemEventDetail<T extends HTMLElement = HTMLElement, V extends ListItem = ListItem> extends ElementEventDetail<T> {
    previous?: ListEntry<V>;
    current?: ListEntry<V>;
    change: boolean;
}

export class ActivateEvent<T extends HTMLElement = HTMLElement, V extends ListItem = ListItem> extends ElementEvent<T, ListItemEventDetail<T, V>> {
    type!: 'ui-activate-item';

    constructor (detail: ListItemEventDetail<T, V>, init?: EventInit) {

        super('ui-activate-item', detail, init);
    }
}

export class SelectEvent<T extends HTMLElement = HTMLElement, V extends ListItem = ListItem> extends ElementEvent<T, ListItemEventDetail<T, V>> {
    type!: 'ui-select-item';

    constructor (detail: ListItemEventDetail<T, V>, init?: EventInit) {

        super('ui-select-item', detail, init);
    }
}

/**
 * Add the list item events to the global HTMLElementEventMap.
 */
declare global {
    interface HTMLElementEventMap {
        'ui-activate-item': ActivateEvent;
        'ui-select-item': SelectEvent;
    }
}
