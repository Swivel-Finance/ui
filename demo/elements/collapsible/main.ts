/* eslint-disable @typescript-eslint/indent */
/* eslint-disable import/no-duplicates */
import { html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { AccordionElement } from '../../../src/elements/collapsible/accordion.js';
import { ToggleChangeEvent } from '../../../src/elements/toggle/events.js';
import '../../../src/elements/icon/icon.js';
import '../../../src/elements/toggle/toggle.js';
import '../../../src/elements/collapsible/collapsible.js';
import '../../../src/elements/collapsible/accordion.js';

const template = function (this: CollapsibleDemoElement) {

    return html`

    <div class="container">

        <h3>Configurable Collapsible</h3>

        <div class="container horizontal half">

            <div class="container vertical">
                <label for="col-animated">Animated</label>
                <ui-toggle
                    id="col-animated"
                    .checked=${ this.colAnimated }
                    @ui-toggle-changed=${ (event: ToggleChangeEvent) => this.colAnimated = event.detail.checked }></ui-toggle>
                <label for="col-expanded">Expanded</label>
                <ui-toggle
                    id="col-expanded"
                    .checked=${ this.colExpanded }
                    @ui-toggle-changed=${ (event: ToggleChangeEvent) => this.colExpanded = event.detail.checked }></ui-toggle>
                <label for="col-content">Content</label>
                <textarea
                    id="col-content"
                    rows="10"
                    @input=${ (event: InputEvent) => this.colContent = (event.target as HTMLTextAreaElement).value }>${ this.colContent }</textarea>
            </div>

            <div class="container vertical">

                <ui-collapsible .animated=${ this.colAnimated } .expanded=${ this.colExpanded }>
                    <h4 data-part="header">
                        <div data-part="trigger">Configure me</div>
                    </h4>
                    <div data-part="region">
                        ${ this.colContent.split('\n\n').map(paragraph => html`<p>${ paragraph }</p>`) }
                    </div>
                </ui-collapsible>

            </div>
        </div>
    </div>

    <div class="container">

        <br>
        <h3>Accordion</h3>

        <p>The <code>ui-accordion</code> element groups multiple <code>ui-collapsible</code> elements and enables the
            non-independent control of its collapsible children.
        </p>

        <p>The <code>ui-accordion</code> element exposes the following <strong>properties</strong>:</p>

        <ul>
            <li>
                <code>multiple</code>: a <code>ui-accordion</code> has two modes of operation which is controlled by
                this property:
                <ul style="list-style: circle; padding: var(--grid-size-l);">
                    <li>
                    when <code>multiple</code> is set to <code>false</code> (default) only one collapsible can be expanded at a time<br>
                    (expanding another collapsible will collapse the currently expanded collapisble)
                    </li>
                    <li>
                    when <code>multiple</code> is set to <code>true</code> any number of collapsibles can be expanded at any time
                    </li>
                </ul>

            </li>
            <li>
                <code>animated</code>: allows to turn on/off animations for the owned <code>ui-collapsible</code> elements
            </li>
        </ul>

        <p>The <code>ui-accordion</code> element exposes the following <strong>methods</strong>:</p>

        <ul>
            <li>
                <code>expandAll()</code>: expand all collapsible children (this requires <code>multiple</code> to be <code>true</code>)<br>
                This method return a <code>Promise&lt;void&gt;</code> which resolves <strong>when the animation is finished</strong>
            </li>
            <li>
                <code>collapseAll()</code>: collapse all collapsible children<br>
                This method return a <code>Promise&lt;void&gt;</code> which resolves <strong>when the animation is finished</strong>
            </li>
        </ul>

        <pre><xmp>
    <ui-accordion>

      <ui-collapsible>
        <h3 data-part="header">
          <span data-part="trigger">Lorem ipsum</span>
        </h3>
        <p data-part="region">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit...
        </p>
      </ui-collapsible>

      <ui-collapsible>
        <h3 data-part="header">
          <span data-part="trigger">Ratione ducimus</span>
        </h3>
        <p data-part="region">
            Ratione ducimus ea quod magnam quos...
        </p>
      </ui-collapsible>

    </ui-accordion>
        </xmp></pre>

        <div class="container horizontal half">

            <div class="container vertical">
                <h4>Configurable Accordion</h4>
                <label for="acc-animated">Animated</label>
                <ui-toggle
                    id="acc-animated"
                    .checked=${ this.accAnimated }
                    @ui-toggle-changed=${ (event: ToggleChangeEvent) => this.accAnimated = event.detail.checked }></ui-toggle>
                <label for="acc-multiple">Multiple</label>
                <ui-toggle
                    id="acc-multiple"
                    .checked=${ this.accMultiple }
                    @ui-toggle-changed=${ (event: ToggleChangeEvent) => this.accMultiple = event.detail.checked }></ui-toggle>
                <button @click=${ () => this.handleToggleContent() }>${ this.accAdditional ? 'Remove Collapsible' : 'Add Collapsible' }</button>
                <button .disabled=${ !this.accMultiple } @click=${ () => this.handleExpandAll() }>Expand All</button>
                <button .disabled=${ !this.accMultiple } @click=${ () => this.handleCollapseAll() }>Collapse All</button>
            </div>

            <div class="container vertical">

                <ui-accordion .animated=${ this.accAnimated } .multiple=${ this.accMultiple } ${ ref(this.accordionRef) }>
                    <ui-collapsible>
                        <h4 data-part="header">
                            <span data-part="trigger">Lorem ipsum</span>
                        </h4>
                        <p data-part="region">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium magni assumenda reprehenderit. Ea eos impedit atque qui error doloribus beatae sequi assumenda voluptatum, quas accusantium excepturi, eveniet quasi quam inventore.</p>
                    </ui-collapsible>
                    <ui-collapsible>
                        <h4 data-part="header">
                            <span data-part="trigger">Ratione ducimus</span>
                        </h4>
                        <p data-part="region">Ratione ducimus ea quod magnam quos? Quos nostrum omnis tempora non maxime eligendi quas, eius doloribus impedit in obcaecati eum fugit delectus voluptatem officiis corporis quo ullam ducimus id odit?</p>
                    </ui-collapsible>
                    <ui-collapsible>
                        <h4 data-part="header">
                            <span data-part="trigger">Totam optio</span>
                        </h4>
                        <p data-part="region">Totam optio quaerat sit animi dolor, excepturi esse? Non nesciunt, nulla architecto ad aspernatur ipsam sed reprehenderit voluptate cum aut, quas fugit aperiam debitis totam ullam eveniet nisi earum accusamus?</p>
                    </ui-collapsible>
                    <ui-collapsible>
                        <h4 data-part="header">
                            <span data-part="trigger">Ipsam</span>
                        </h4>
                        <p data-part="region">Ipsam, voluptas qui. Suscipit facilis, optio nisi ipsum earum minima voluptatum veniam magnam praesentium dolor ad perferendis ipsa saepe velit veritatis blanditiis nulla assumenda. Ad nam asperiores corporis iusto dolorem.</p>
                    </ui-collapsible>
                    ${ this.accAdditional
                        ? html`
                        <ui-collapsible>
                            <h4 data-part="header">
                                <span data-part="trigger">Adipisci facere</span>
                            </h4>
                            <p data-part="region">Adipisci facere delectus dolorum mollitia, quod rem. Quaerat facere nemo ipsum molestias quos ut animi in aperiam, possimus assumenda corporis cum repudiandae ex officia quisquam necessitatibus aliquam modi quibusdam soluta.</p>
                        </ui-collapsible>
                        `
                        : nothing
                    }
                </ui-accordion>

            </div>
        </div>
    </div>
    `;
};

@customElement('demo-collapsible')
export class CollapsibleDemoElement extends LitElement {

    protected accordionRef = createRef<AccordionElement>();

    @state()
    protected colAnimated = true;

    @state()
    protected colExpanded = true;

    @state()
    protected colContent = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus dignissimos voluptates suscipit eaque inventore id sint accusamus pariatur architecto, dolor voluptatem repudiandae dicta quaerat aut porro omnis soluta nostrum molestiae.

Nesciunt excepturi ad asperiores sed! Ipsum fugiat totam quae assumenda error eligendi exercitationem, suscipit cum nulla inventore consequatur reprehenderit, repellat minus laboriosam autem corrupti harum ex quia laborum similique dignissimos.`;

    @state()
    protected accAnimated = true;

    @state()
    protected accMultiple = false;

    @state()
    protected accAdditional = false;

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return template.apply(this);
    }

    protected handleExpandAll (): void {

        void this.accordionRef.value?.expandAll();
    }

    protected handleCollapseAll (): void {

        void this.accordionRef.value?.collapseAll();
    }

    protected handleToggleContent (): void {

        this.accAdditional = !this.accAdditional;
    }
}
