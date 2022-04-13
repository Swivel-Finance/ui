import { ClassNames, CLASS_MAP } from '../utils/index.js';

export interface ListConfig {
    classes: Record<ClassNames, string>;
    /**
     * The `role` used for the list.
     *
     * @remarks
     * Common roles for list-style widgets include: listbox, menu, menubar, tablist, toolbar.
     */
    role: string | undefined;
    /**
     * The `role` used for the list items.
     *
     * @remarks
     * Common roles for list-style widgets include: option, menuitem, menuitemradio, menuitemchackbox, tab.
     */
    itemRole: string | undefined;
    /**
     * The list's item layout (controls which arrow keys navigate the list).
     */
    orientation: 'horizontal' | 'vertical' | undefined;
    /**
     * Whether to "wrap around" the navigation when navigating past the first or last list item.
     */
    wrap?: boolean;
}

export const LIST_CONFIG_DEFAULT: ListConfig = {
    classes: CLASS_MAP,
    role: 'listbox',
    itemRole: 'option',
    orientation: 'vertical',
    wrap: true,
};

export const LIST_CONFIG_MENU: ListConfig = {
    classes: CLASS_MAP,
    role: 'menu',
    itemRole: 'menuitem',
    orientation: 'vertical',
    wrap: true,
};

export const LIST_CONFIG_MENU_RADIO: ListConfig = {
    classes: CLASS_MAP,
    role: 'menu',
    itemRole: 'menuitemradio',
    orientation: 'vertical',
    wrap: true,
};
