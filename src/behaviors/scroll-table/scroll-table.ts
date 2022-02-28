import { EventManager } from '../../utils/events/index.js';
import { debounce } from '../../utils/methods/index.js';
import { Behavior } from '../behavior.js';
import { ScrollTableConfig, SCROLL_TABLE_CONFIG_DEFAULT } from './config.js';

export class ScrollTableBehavior extends Behavior {

    protected eventManager = new EventManager();

    protected config: ScrollTableConfig;

    protected head?: HTMLElement;

    protected body?: HTMLElement;

    protected get headColumns (): HTMLTableCellElement[] {

        return Array.from(this.head?.querySelectorAll<HTMLTableCellElement>('tr > th') ?? []);
    }

    protected get bodyColumns (): HTMLTableCellElement[] {

        return Array.from(this.body?.querySelectorAll<HTMLTableCellElement>('tr:first-of-type > td') ?? []);
    }

    constructor (config?: Partial<ScrollTableConfig>) {

        super();

        this.config = { ...SCROLL_TABLE_CONFIG_DEFAULT, ...config };
    }

    /**
     * @param e - the table element
     * @param h - the table's thead element
     * @param b - the table's tbody element
     */
    attach (e: HTMLElement, h?: HTMLElement, b?: HTMLElement): boolean {

        if (!super.attach(e)) return false;

        this.head = h ?? e.querySelector('thead') ?? undefined;
        this.body = b ?? e.querySelector('tbody') ?? undefined;

        this.addListeners();
        this.syncLayout();
        this.syncScroll();

        return true;
    }

    detach () {

        if (!this.hasAttached) return false;

        this.removeListeners();
        this.resetLayout();

        this.head = undefined;
        this.body = undefined;

        return super.detach();
    }

    update () {

        this.syncLayout();
        this.syncScroll();
    }

    protected addListeners () {

        if (this.body) {

            this.eventManager.listen(this.body, 'scroll', this.handleScroll.bind(this));
        }

        this.eventManager.listen(window, 'resize', debounce(this.handleResize.bind(this)));
    }

    protected removeListeners () {

        this.eventManager.unlistenAll();
    }

    protected syncLayout () {

        // we first reset the layout, so the browser can auto-layout the table
        this.resetLayout();

        if (!this.element || !this.head || !this.body) return;

        // to properly compensate for scrollbar widths, we need to check if we will have scrollbars in the table
        // we can check that by comparing the width and height of the browser-layouted table to the container
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const container = this.element.parentElement!;

        if (this.element.offsetWidth > container.clientWidth) {

            this.element.classList.add(this.config.classHorizontal);
        }

        if (this.element.offsetHeight > container.clientHeight) {

            this.element.classList.add(this.config.classVertical);
        }

        const headColumns = this.headColumns;
        const bodyColumns = this.bodyColumns;

        // after the layout is reset, we can grab the column widths from the header cells and ceil them
        // (the reset enusures the default table layout is applied and the browser calculates the proper widths)
        const widths = headColumns.map(column => Math.ceil(column.getBoundingClientRect().width));

        // we sync the width of the header and row columns
        headColumns.forEach((column, index) => {
            column.style.minWidth = `${ widths[index] }px`;
            column.style.maxWidth = `${ widths[index] }px`;
        });

        bodyColumns.forEach((column, index) => {
            column.style.minWidth = `${ widths[index] }px`;
            column.style.maxWidth = `${ widths[index] }px`;
        });

        this.element?.classList.add(this.config.class);
    }

    protected resetLayout () {

        if (!this.head || !this.body) return;

        this.element?.classList.remove(this.config.class);
        this.element?.classList.remove(this.config.classVertical);
        this.element?.classList.remove(this.config.classHorizontal);

        // we reset the width of the header and row columns
        this.headColumns.forEach((column) => {
            column.style.removeProperty('max-width');
            column.style.removeProperty('min-width');
        });

        this.bodyColumns.forEach((column) => {
            column.style.removeProperty('max-width');
            column.style.removeProperty('min-width');
        });
    }

    protected syncScroll () {

        if (!this.head) return;

        this.head.scrollLeft = this.body?.scrollLeft ?? 0;
    }

    protected handleScroll () {

        this.syncScroll();
    }

    protected handleResize () {

        void this.syncLayout();
    }
}
