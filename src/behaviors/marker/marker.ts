import { dispatch, ElementEvent } from '../../utils/events/index.js';

declare global {
    interface ElementEventMap {
        'ui-marker-added': MarkerAddedEvent;
        'ui-marker-removed': MarkerRemovedEvent;
    }
}

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

export class MarkerElement extends HTMLElement {

    connectedCallback (): void {

        this.setAttribute('hidden', '');

        dispatch(this, new MarkerAddedEvent(this));
    }

    disconnectedCallback (): void {

        dispatch(this, new MarkerRemovedEvent(this));
    }
}

customElements.define('ui-marker', MarkerElement);
