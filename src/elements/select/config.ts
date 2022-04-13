import { ListConfig, LIST_CONFIG_DEFAULT, LIST_CONFIG_MENU, LIST_CONFIG_MENU_RADIO } from '../../behaviors/list/index.js';
import { PopupConfig, POPUP_CONFIG_DEFAULT } from '../popup/index.js';

export interface SelectConfig extends PopupConfig {
    list: ListConfig;
}

export const SELECT_CONFIG_DEFAULT: SelectConfig = {
    ...POPUP_CONFIG_DEFAULT,
    classes: {
        overlay: 'ui-select-overlay',
        trigger: 'ui-select-trigger',
    },
    position: {
        ...POPUP_CONFIG_DEFAULT.position,
        width: 'origin',
        alignment: {
            ...POPUP_CONFIG_DEFAULT.position.alignment,
            origin: {
                horizontal: 'center',
                vertical: 'start',
            },
            target: {
                horizontal: 'center',
                vertical: 'start',
            },
        },
    },
    trigger: {
        ...POPUP_CONFIG_DEFAULT.trigger,
        role: 'listbox',
    },
    overlay: {
        ...POPUP_CONFIG_DEFAULT.overlay,
        role: 'listbox',
    },
    list: {
        ...LIST_CONFIG_DEFAULT,
    },
};

export const SELECT_CONFIG_MENU: SelectConfig = {
    ...SELECT_CONFIG_DEFAULT,
    trigger: {
        ...SELECT_CONFIG_DEFAULT.trigger,
        role: 'menu',
    },
    overlay: {
        ...SELECT_CONFIG_DEFAULT.overlay,
        role: 'menu',
    },
    list: {
        ...LIST_CONFIG_MENU,
    },
};

export const SELECT_CONFIG_MENU_RADIO: SelectConfig = {
    ...SELECT_CONFIG_MENU,
    list: {
        ...LIST_CONFIG_MENU_RADIO,
    },
};
