import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ListItem } from '../../behaviors/list/types.js';

@customElement('ui-listitem')
export class ListItemElement<T = unknown> extends LitElement implements ListItem {

    @property()
    value?: T;

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }
}
