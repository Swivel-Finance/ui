import { OpenChangeEvent } from '../../behaviors/overlay/events.js';
import { CollapsibleElement } from './collapsible.js';

export interface CollapsibleElementEventMap extends HTMLElementEventMap {
    'ui-open-changed': OpenChangeEvent<CollapsibleElement>;
}
