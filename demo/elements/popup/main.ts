import { html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LIST_CONFIG_MENU } from '../../../src/behaviors/list/config.js';
import { SelectEvent } from '../../../src/behaviors/list/events.js';
import { FocusListBehavior } from '../../../src/behaviors/list/focus-list.js';
import { OpenChangeEvent } from '../../../src/behaviors/overlay/index.js';
import { POSITION_CONFIG_TOOLTIP } from '../../../src/elements/index.js';
import { PopupConfig, PopupElement, POPUP_CONFIG_MENU } from '../../../src/elements/popup/index.js';
import { tokenAmount } from '../../../src/elements/templates/amounts.js';
import { DeepPartial } from '../../../src/utils/types.js';
import '../../../src/elements/icon/icon.js';
import '../../../src/elements/popup/popup.js';

/**
 * A config for info popups.
 *
 * @remarks
 * This config uses the tooltip position config and adds a maxWidth.
 * In addition, closing on focus loss is disabled.
 */
const POPUP_CONFIG_INFO: DeepPartial<PopupConfig> = {
    position: {
        ...POSITION_CONFIG_TOOLTIP,
        maxWidth: 'calc(var(--line-height) * 20)',
    },
    overlay: {
        // don't include in the stack (keep open when other overlays are opened)
        stacked: false,
        closeOnFocusLoss: false,
    },
};

/**
 * A config for nav popups.
 *
 * @remarks
 * This config extends the menu popup config and adds a custom alignment.
 */
const POPUP_CONFIG_NAV: DeepPartial<PopupConfig> = {
    ...POPUP_CONFIG_MENU,
    position: {
        alignment: {
            origin: {
                horizontal: 'end',
                vertical: 'end',
            },
            target: {
                horizontal: 'end',
                vertical: 'start',
            },
            offset: {
                vertical: 'var(--line-height)',
            },
        },
    },
};

/**
 * A config for the proxy popup.
 *
 * @remarks
 * This config will be based on the default popup.
 */
const POPUP_CONFIG_PROXY: DeepPartial<PopupConfig> = {
    focus: {
        initialFocus: 'input[type=text]',
        trapFocus: true,
    },
    overlay: {
        closeOnFocusLoss: false,
    },
};

const template = function (this: PopupDemoElement): TemplateResult {

    return html`

    <div class="container horizontal third">

        <div class="container vertical">
            <h3>Basic Popup</h3>

            <ui-popup ${ ref(this.redeemPopup) }>
                <button type="button" data-part="trigger">Redeem</button>
                <div data-part="overlay" class="redeem-overlay">
                    <p><strong>Redeem your rewards</strong></p>
                    <dl><dt>Amount:</dt><dd>${ tokenAmount(this.redeemable || '0.00', 'USDC') }</dd></dl>
                    <div>
                        <button type="button" class="primary" .disabled=${ !this.redeemable } @click=${ () => this.handleRedeem() }>Redeem</button>
                        <button type="button" @click=${ () => this.handleCancelRedeem() }>Cancel</button>
                    </div>
                </div>
            </ui-popup>

            <p>This popup uses the default configuration and uses data- and event-binding to display and control information
                from its parent component.</p>
        </div>

        <div class="container vertical">
            <h3>Info Popup</h3>

            <ui-popup class="info-popup" .config=${ POPUP_CONFIG_INFO }>
                <ui-icon name="question" data-part="trigger" tabindex="0" role="button"></ui-icon>
                <div data-part="overlay">
                    <p><strong>Some information</strong></p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi impedit recusandae obcaecati voluptatibus magni.</p>
                    <p>For more information visit our <a href="https://docs.swivel.finance">docs</a>.</p>
                </div>
            </ui-popup>

            <p>This popup uses a custom configuration to position the overlay like a tooltip (including the offset between trigger
                and overlay), limit the width of the overlay to 20 lines and disable hiding the overlay when focus is lost. To
                hide this popup, the trigger has to be clicked or <code>ESC</code> needs to be pressed while the overlay has focus.</p>
            <p>A configuration like this can be a useful replacement for tooltips, when the content contains interactive
                elements, like links or buttons.</p>
        </div>

        <div class="container vertical">
            <h3>Navigation Popup</h3>

            <ui-popup class="nav-popup" .config=${ POPUP_CONFIG_NAV } ${ ref(this.navPopup) }>
                <button type="button" class="nav-button" data-part="trigger"><ui-icon name="more"></ui-icon></button>
                <nav class="nav-overlay" data-part="overlay"
                    @ui-open-changed=${ (event: OpenChangeEvent) => this.handleNavOpenChange(event) }
                    @ui-select-item=${ (event: SelectEvent) => this.handleNavSelection(event) }>
                    ${ this.links.map(item => html`
                    <a href="${ item.href }" aria-disabled="${ item.disabled ? 'true' : 'false' }">
                        <ui-icon name="${ item.icon }"></ui-icon>${ item.label }
                    </a>`) }
                </nav>
            </ui-popup>

            <p>This example uses a custom configuration to align the overlay to the bottom right of the trigger and add
                some vertical offset. In addition the configuration marks the overlay as <code>role=menu</code>.</p>
            <p>The overlay is a simple <code>nav</code> element containing <code>a</code> elements.</p>
            <p>The parent component manages a separate <code><a href="../../behaviors/list/">FocusListBehavior</a></code>
                which provides the accessible keyboard navigation for the <code>nav</code> element. It also subscribes
                to the overlay behavior's <code>ui-open-change</code> event to attach and detach the list behavior, as
                well as to the list behavior's <code>ui-select-item</code> event to trigger browser navigation for
                keyboard interactions.</p>
        </div>
    </div>

    <h3>Behavior Proxies</h3>

    <div class="container horizontal half">

        <div class="container vertical">

            <div class="horizontal" style="justify-content: space-between;">

                <ui-popup .config=${ POPUP_CONFIG_PROXY } ${ ref(this.proxyPopup) }>
                    <button type="button" data-part="trigger">Popup</button>
                    <div class="vertical" data-part="overlay">
                        <p>Lorem, ipsum dolor sit amet <a href="#">consectetur</a> adipisicing elit.</p>
                        <input type="text" placeholder="Lorem ipsum...">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing <a href="#">elit</a>.</p>
                    </div>
                </ui-popup>

            </div>

            <div class="horizontal" style="justify-content: end;">
                <button id="origin-empty" type="button">Empty</button>
            </div>

            <div class="container vertical" style="margin-block-start: calc(var(--line-height) * 8);">

                <p>Control the visibility of the popup from the outside:</p>

                <div class="horizontal" style="font-family: var(--font-family-mono);">
                    <button type="button" @click="${ () => this.proxyPopup.value?.show() }">show()</button>
                    <button type="button" @click="${ () => this.proxyPopup.value?.hide() }">hide()</button>
                    <button type="button" @click="${ () => this.proxyPopup.value?.toggle() }">toggle()</button>
                </div>

                <p>
                    Update the postion of the popup from the outside, e.g. move it to a different element: <br/>
                    (The popup has to be open for <code>updatePosition()</code> to work.)
                </p>

                <div class="horizontal" style="font-family: var(--font-family-mono);">
                    <button type="button" @click="${ () => this.proxyPopup.value?.updatePosition(document.getElementById('origin-empty') as HTMLElement) }">
                        updatePosition()
                    </button>
                </div>

                <p>
                    Update the focused element inside the popup: <br>
                    (The popup has to be open to set the focus.)
                </p>

                <div class="horizontal" style="font-family: var(--font-family-mono);">
                    <button type="button" @click="${ () => this.proxyPopup.value?.focusInitial() }">focusInitial()</button>
                    <button type="button" @click="${ () => this.proxyPopup.value?.focusFirst() }">focusFirst()</button>
                    <button type="button" @click="${ () => this.proxyPopup.value?.focusLast() }">focusLast()</button>
                </div>

            </div>

        </div>

        <div class="container vertical">
            <p>
                The <code>ui-popup</code> element owns and orchestrates a set of behaviors to provide the functionality
                you would expect from a popup. These behaviors include:
            </p>
            <ul>
                <li><code><a href="../../behaviors/focus/">FocusMonitor/FocusTrap</a></code></li>
                <li><code><a href="../../behaviors/overlay/">PositionBehavior</a></code></li>
                <li><code><a href="../../behaviors/overlay/">OverlayTriggerBehavior</a></code></li>
                <li><code><a href="../../behaviors/overlay/">OverlayBehavior</a></code></li>
            </ul>
            <p>
                As the <code>ui-popup</code> element owns these behaviors, they are not exposed on the element itself.
                However, some of the behavior APIs are proxied by <code>ui-popup</code>:
            </p>
            <ul>
                <li>
                    <code>show()</code>: show the popup
                </li>
                <li>
                    <code>hide()</code>: hide the popup
                </li>
                <li>
                    <code>toggle()</code>: toggle the popup
                </li>
                <li>
                    <code>updatePosition()</code>: update the popup overlay's position
                </li>
            </ul>
            <p>
                Additionally, if the popup is using a <code>FocusTrap</code> the following proxy methods are available:
            </p>
            <ul>
                <li>
                    <code>focusInitial()</code>: focus the 'initial' element inside the popup overlay (see
                    <code>FocusTrapConfig.initialFocus</code>)
                </li>
                <li>
                    <code>focusFirst()</code>: focus the first focusable element inside the popup overlay
                </li>
                <li>
                    <code>focusLast()</code>: focus the last focusable element inside the popup overlay
                </li>
            </ul>
        </div>
    </div>
    `;
};

@customElement('demo-popup')
export class PopupDemoElement extends LitElement {

    protected redeemPopup = createRef<PopupElement>();

    @state()
    protected redeemable = '105.45';

    protected navPopup = createRef<PopupElement>();

    @state()
    protected links = [
        {
            label: 'Professional',
            href: '#',
            icon: 'professional',
        },
        {
            label: 'Positions',
            href: '#',
            icon: 'positions',
        },
        {
            label: 'Docs',
            href: '#',
            icon: 'docs',
        },
        {
            label: 'Discord',
            href: '#',
            icon: 'discord',
        },
        {
            label: 'Cookie Policy',
            href: '#',
            icon: 'policy',
        },
        {
            label: 'Privacy Policy',
            href: '#',
            icon: 'policy',
        },
        {
            label: 'Tour Swivel',
            href: '#',
            icon: 'tour',
        },
        {
            label: 'Light Mode',
            href: '#',
            icon: 'light',
            disabled: true,
        },
    ];

    protected listBehavior = new FocusListBehavior({ ...LIST_CONFIG_MENU });

    protected proxyPopup = createRef<PopupElement>();

    protected render (): unknown {

        return template.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected handleRedeem (): void {

        this.redeemable = '';

        void this.redeemPopup.value?.hide(true);
    }

    protected handleCancelRedeem (): void {

        void this.redeemPopup.value?.hide(true);
    }

    protected handleNavOpenChange (event: OpenChangeEvent): void {

        if (event.detail.open) {

            const list = event.detail.target;
            const items = list.querySelectorAll('a');

            this.listBehavior.attach(list, items);

        } else {

            // reset the selection
            this.listBehavior.setSelected(0);
            this.listBehavior.setActive(0);
            this.listBehavior.detach();
        }
    }

    protected async handleNavSelection (event: SelectEvent): Promise<void> {

        const index = event.detail.current?.index;
        const href = index !== undefined
            ? this.links[index].href
            : location.href;

        await this.navPopup.value?.hide(true);

        location.href = href;
    }
}
