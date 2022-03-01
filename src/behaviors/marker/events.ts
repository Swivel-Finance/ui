import { ElementEvent } from '../../utils/events/index.js';
import type { MarkerElement } from './marker';

export class MarkerAddedEvent extends ElementEvent<MarkerElement> {

    type!: 'ui-marker-added';

    constructor (marker: MarkerElement, init?: EventInit) {

        super('ui-marker-added', { target: marker }, init);
    }
}

export class MarkerRemovedEvent extends ElementEvent<MarkerElement> {

    type!: 'ui-marker-removed';

    constructor (marker: MarkerElement, init?: EventInit) {

        super('ui-marker-removed', { target: marker }, init);
    }
}

declare global {
    interface ElementEventMap {
        'ui-marker-added': MarkerAddedEvent;
        'ui-marker-removed': MarkerRemovedEvent;
    }
}
