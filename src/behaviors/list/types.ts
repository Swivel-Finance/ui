
export interface ListItem extends HTMLElement {
    disabled?: boolean;
}

export interface ListEntry<T extends ListItem = ListItem> {
    item: T;
    index: number;
}

export type ListEntryState = 'active' | 'selected';

export type ListEntryLocator = 'current' | 'next' | 'previous' | 'first' | 'last';
