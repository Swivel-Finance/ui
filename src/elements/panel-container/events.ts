import { ElementEvent, ElementEventDetail } from '../../utils/events';
import { PanelDirection } from './types';

export interface PanelNavigationEventDetail<T extends HTMLElement = HTMLElement> extends ElementEventDetail<T> {
    panel: number | PanelDirection;
}

export class PanelNavigationEvent<T extends HTMLElement = HTMLElement> extends ElementEvent<T, PanelNavigationEventDetail<T>> {

    type!: 'ui-panel-navigation';

    constructor (detail: PanelNavigationEventDetail<T>, init?: EventInit) {

        super('ui-panel-navigation', detail, init);
    }
}

export interface PanelChangeEventDetail<T extends HTMLElement = HTMLElement> extends ElementEventDetail<T> {
    panel: number;
}

export class PanelChangeEvent<T extends HTMLElement = HTMLElement> extends ElementEvent<T, PanelChangeEventDetail<T>> {

    type!: 'ui-panel-changed';

    constructor (detail: PanelChangeEventDetail<T>, init?: EventInit) {

        super('ui-panel-changed', detail, init);
    }
}

/**
 * Add the event to the global HTMLElementEventMap.
 */
declare global {
    interface HTMLElementEventMap {
        'ui-panel-navigation': PanelNavigationEvent;
        'ui-panel-changed': PanelChangeEvent;
    }
}
