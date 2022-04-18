export const SELECTION_ATTRIBUTE_MAP = {
    'checkbox': 'aria-checked',
    'radio': 'aria-checked',
    'menuitem': 'aria-selected',
    'menuitemcheckbox': 'aria-checked',
    'menuitemradio': 'aria-checked',
    'option': 'aria-selected',
    'tab': 'aria-selected',
    'default': 'aria-selected',
};

export const selectionAttribute = (item: HTMLElement | undefined, role?: string): string => {

    return SELECTION_ATTRIBUTE_MAP[(item?.getAttribute('role') || role) as keyof typeof SELECTION_ATTRIBUTE_MAP || 'default']
        ?? SELECTION_ATTRIBUTE_MAP['default'];
};

export const isSelected = (item: HTMLElement | undefined, role?: string): boolean => {

    return item?.getAttribute(selectionAttribute(item, role)) === 'true';
};
