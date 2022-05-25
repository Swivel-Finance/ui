import { ElementEvent, ElementEventDetail } from '../../utils/events/index.js';
import type { DialogElement } from './dialog.js';

export interface DialogResultEventDetail<V = unknown> extends ElementEventDetail<DialogElement<V>> {
    result: V | undefined;
}

export class DialogResultEvent<V = unknown> extends ElementEvent<DialogElement<V>, DialogResultEventDetail<V>> {

    type!: 'ui-dialog-result';

    constructor (detail: DialogResultEventDetail<V>, init?: EventInit) {

        super('ui-dialog-result', detail, init);
    }
}

export interface DialogElementEventMap<V = unknown> extends HTMLElementEventMap {
    'ui-dialog-result': DialogResultEvent<V>;
}
