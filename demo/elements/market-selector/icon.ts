import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const template = function (this: IconElement) {

    return html`<svg focusable="false"><use href="${ this.sprite }#${ this.name }" /></svg>`;
};

@customElement('sw-icon')
export class IconElement extends LitElement {

    @property({ attribute: true })
    name = '';

    @property({ attribute: true })
    sprite = './icons.svg';

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return template.apply(this);
    }
}
