import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { FocusTrap } from '../../../src/behaviors/focus/index.js';
import { ActivateEvent, ListBehavior, SelectEvent } from '../../../src/behaviors/list/index.js';
import { OpenChangeEvent, OverlayBehavior, OverlayTriggerBehavior } from '../../../src/behaviors/overlay/index.js';
import { PositionBehavior, POSITION_CONFIG_CONNECTED } from '../../../src/behaviors/position/index.js';
import { delay } from '../../../src/utils/async/index.js';
import { cancel } from '../../../src/utils/events/index.js';
import { ARROW_DOWN, ARROW_UP, ENTER } from '../../../src/utils/index.js';
import { Market, marketKey, MARKET_MOCKS, maturityDate, maturityDays } from './market.js';

const marketTemplate = (market: Market, list = false) => html`
<div class="market">
    <div class="identifier">
        <sw-symbol .name=${ market.tokens.underlying.image }></sw-symbol>
        <span class="unit">${ market.tokens.underlying.symbol }</span>
        <sw-symbol .name=${ market.protocol.image }></sw-symbol>
        <span>${ market.protocol.name }</span>
        <span>${ market.lastTradePrice ?? '-' }<span class="unit">%</span></span>
    </div>
    <div class="extra">
        <span>${ list ? maturityDate(market.maturity) : `Matures in ${ maturityDays(market.maturity) } day(s)` }</span>
        <span>${ market.supplyRate }<span class="unit">%</span></span>
    </div>
</div>
`;

const template = function (this: MarketSelector) {

    const selected = this.markets?.get(this.selected) as Market;

    return html`
    <button ${ ref(this.triggerRef) }>
    ${ this.fetching ? html`Fetching Markets...` : marketTemplate(selected) }
    </button>
    <div class="sw-market-selector-overlay" ${ ref(this.overlayRef) }>
        <input type="text"
            placeholder="Filter Markets"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="sw-market-selector-listbox"
            aria-expanded="true"
            aria-activedescendant="${ this.activeDescendant }"
            ${ ref(this.searchRef) }
            @keydown=${ (event: KeyboardEvent) => this.handleKeyDown(event) }
            @input=${ () => this.handleInput() }>
        <sw-icon name="search"></sw-icon>
        <ul id="sw-market-selector-listbox" ${ ref(this.listRef) }
            @ui-activate-item=${ (event: ActivateEvent) => this.handleActivateItem(event) }
            @ui-select-item=${ (event: SelectEvent) => this.handleSelectItem(event) }>
            ${ [...this.markets.entries()].map(([key, market]) => html`
            <li data-value="${ key }" aria-selected="${ this.selected === key ? 'true' : 'false' }">
                ${ marketTemplate(market, true) }
            </li>`) }
        </ul>
    </div>
    `;
};

@customElement('sw-market-selector')
export class MarketSelector extends LitElement {

    protected triggerRef: Ref<HTMLButtonElement> = createRef();

    protected overlayRef: Ref<HTMLElement> = createRef();

    protected searchRef: Ref<HTMLInputElement> = createRef();

    protected listRef: Ref<HTMLUListElement> = createRef();

    protected triggerBehavior?: OverlayTriggerBehavior;

    protected overlayBehavior?: OverlayBehavior;

    protected listBehavior?: ListBehavior;

    @property()
    protected activeDescendant?: string;

    markets = new Map<string, Market>();

    @property()
    selected = '';

    @property()
    fetching = false;

    connectedCallback (): void {

        super.connectedCallback();

        void this.fetchMarkets();
    }

    disconnectedCallback (): void {

        this.listBehavior?.detach();
        this.overlayBehavior?.detach();
        this.triggerBehavior?.detach();
    }

    protected firstUpdated (): void {

        this.triggerBehavior = new OverlayTriggerBehavior();

        this.overlayBehavior = new OverlayBehavior({
            triggerBehavior: this.triggerBehavior,
            focusBehavior: new FocusTrap(),
            positionBehavior: new PositionBehavior({
                ...POSITION_CONFIG_CONNECTED,
                origin: this.triggerRef.value as HTMLElement,
                alignment: {
                    origin: {
                        horizontal: 'center',
                        vertical: 'start',
                    },
                    target: {
                        horizontal: 'center',
                        vertical: 'start',
                    },
                },
                safeZone: {
                    horizontal: 'var(--line-height)',
                    vertical: 'var(--line-height)',
                },
                width: 'origin',
                minHeight: 'origin',
            }),
            animated: true,
        });

        this.listBehavior = new ListBehavior();

        this.overlayBehavior.attach(this.overlayRef.value as HTMLElement);
        this.triggerBehavior.attach(this.triggerRef.value as HTMLElement, this.overlayBehavior);

        this.overlayRef.value?.addEventListener('ui-open-changed', this.handleOpenChange.bind(this));
    }

    render (): unknown {

        return template.apply(this);
    }

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected async fetchMarkets (): Promise<void> {

        if (this.fetching) return;

        this.fetching = true;

        await delay(() => {

            MARKET_MOCKS.forEach(market => this.markets.set(marketKey(market), market));
            this.selected = marketKey(MARKET_MOCKS[0]);

        }, 1000).done;

        this.fetching = false;
    }

    protected filterMarkets (term: string): void {

        const list = this.listRef.value as HTMLElement;
        const items = list.querySelectorAll('li');

        term = term.toLowerCase();

        items.forEach(item => {

            const match = term !== '' && !item.innerText.toLowerCase().includes(term);

            item.hidden = match;
        });

        this.listBehavior?.scrollTo('active');
    }

    protected handleOpenChange (event: OpenChangeEvent): void {

        if (event.detail.open) {

            const list = this.listRef.value as HTMLElement;
            const items = list.querySelectorAll('li');

            this.listBehavior?.attach(list, items);
            this.listBehavior?.setActive(this.listBehavior.selectedEntry ?? 'first', true);

        } else {

            this.listBehavior?.detach();
        }
    }

    protected handleKeyDown (event: KeyboardEvent): void {

        switch (event.key) {

            case ARROW_UP:
                cancel(event);
                this.listBehavior?.setActive('previous', true);
                break;

            case ARROW_DOWN:
                cancel(event);
                this.listBehavior?.setActive('next', true);
                break;

            case ENTER:
                cancel(event);
                if (this.listBehavior?.activeEntry) this.listBehavior.setSelected(this.listBehavior.activeEntry, true);
                break;
        }
    }

    protected handleInput (): void {

        this.filterMarkets(this.searchRef.value?.value ?? '');

        if (!this.listBehavior?.activeEntry || this.listBehavior?.activeEntry.item.hidden) {

            if (this.searchRef.value?.value !== '') {

                this.listBehavior?.setActive('first', true);

            } else {

                this.listBehavior?.setActive(this.listBehavior.selectedEntry ?? 'first', true);
            }
        }
    }

    protected handleActivateItem (event: ActivateEvent): void {

        this.activeDescendant = event.detail.current?.item.id;
    }

    protected handleSelectItem (event: SelectEvent): void {

        this.selected = event.detail.current?.item.dataset.value as string ?? '';

        if (this.searchRef.value) {

            this.searchRef.value.value = '';
            this.handleInput();
        }

        void this.overlayBehavior?.hide(true);
    }
}
