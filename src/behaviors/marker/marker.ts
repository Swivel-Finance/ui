import { dispatch } from '../../utils/events/index.js';
import { MarkerAddedEvent, MarkerRemovedEvent } from './events';

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
