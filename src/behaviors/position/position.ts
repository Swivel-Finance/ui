import { animationtask, cancelTask, TaskReference } from '../../utils/async/index.js';
import { AttributeManager } from '../../utils/dom/index.js';
import { EventManager } from '../../utils/events/index.js';
import { Behavior } from '../behavior.js';
import { PositionConfig, POSITION_CONFIG_DEFAULT } from './config.js';
import { AlignmentPair, BoundingBox, getAlignedPosition, getBoundingBox, Offset, Origin, PositionStyles, Size, style, styleAttribute } from './utils/index.js';

export class PositionBehavior extends Behavior {

    protected _config!: PositionConfig;

    protected updateTask?: TaskReference<void>;

    protected attributeManager?: AttributeManager;

    protected eventManager = new EventManager();

    protected mutationObserver = new MutationObserver(this.handleMutation.bind(this));

    protected zone!: Offset<number>;

    protected offset!: Offset<number>;

    protected styles!: PositionStyles;

    protected currentOrigin?: Origin;

    protected currentSize?: Size;

    protected nextOrigin?: Origin;

    protected nextSize?: Size;

    get config (): PositionConfig {

        return this._config;
    }

    set config (value: PositionConfig) {

        this._config = value;

        if (this.hasAttached) this.initialize();
    }

    constructor (config?: Partial<PositionConfig>) {

        super();

        this.config = { ...POSITION_CONFIG_DEFAULT, ...config };
    }

    attach (element: HTMLElement): boolean {

        if (!super.attach(element)) return false;

        this.initialize();

        this.attributeManager = new AttributeManager(element);

        this.addAttributes();
        this.addListeners();

        void this.requestUpdate();

        return true;
    }

    detach (): boolean {

        if (!this.hasAttached) return false;

        if (this.updateTask) {

            cancelTask(this.updateTask);

            this.updateTask = undefined;
        }

        this.removeListeners();
        this.removeAttributes();

        this.currentOrigin = undefined;
        this.currentSize = undefined;
        this.nextOrigin = undefined;
        this.nextSize = undefined;

        return super.detach();
    }

    requestUpdate (origin?: Origin, size?: Size): Promise<void> {

        this.nextOrigin = origin;
        this.nextSize = size;

        if (this.updateTask) return this.updateTask.done;

        this.updateTask = animationtask(() => {

            this.updateTask = undefined;

            this.update(this.nextOrigin, this.nextSize);
        });

        return this.updateTask.done;
    }

    update (origin?: Origin, size?: Size): void {

        const styles = this.updatePosition(origin, size);

        this.updateStyles(styles);
    }

    protected initialize (): void {

        const { zone, offset } = this.initializeOffsets();

        this.zone = zone;
        this.offset = offset;
        this.styles = this.initializeStyles();

        this.currentOrigin = this.config.origin;
        this.currentSize = {
            width: this.config.width,
            height: this.config.height,
            maxWidth: this.config.maxWidth,
            maxHeight: this.config.maxHeight,
            minWidth: this.config.minWidth,
            minHeight: this.config.minHeight,
        };
    }

    protected addAttributes (): void {

        this.attributeManager?.set('style', styleAttribute(this.styles));
    }

    protected removeAttributes (): void {

        this.attributeManager?.restoreAll();
    }

    protected addListeners (): void {

        if (!this.element) return;

        this.eventManager.listen(window, 'resize', this.handleResize.bind(this), { capture: true, passive: true });
        this.eventManager.listen(document, 'scroll', this.handleScroll.bind(this), { capture: true, passive: true });
        this.mutationObserver.observe(this.element, { childList: true, subtree: true });
    }

    protected removeListeners (): void {

        this.eventManager.unlistenAll();
        this.mutationObserver.disconnect();
    }

    protected handleScroll (event: Event): void {

        if (!this.element || !this.hasAttached) return;

        // don't update position if the scroll event originates from within the overlay
        if (this.element.contains(event.target as Node)) return;

        void this.requestUpdate();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleResize (event: Event): void {

        if (!this.element || !this.hasAttached) return;

        void this.requestUpdate();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected handleMutation (mutations: MutationRecord[], observer: MutationObserver): void {

        if (!this.element || !this.hasAttached) return;

        void this.requestUpdate();
    }

    protected initializeStyles (originBox?: BoundingBox, size?: Size): PositionStyles {

        if (!originBox) originBox = getBoundingBox(this.config.origin);
        if (!size) size = this.config;

        return {
            position: 'absolute',
            top: '0',
            left: '0',
            right: 'unset',
            bottom: 'unset',
            width: size.width === 'origin'
                ? style(originBox.width)
                : style(size.width),
            minWidth: size.minWidth === 'origin'
                ? style(originBox.width)
                : style(size.minWidth),
            maxWidth: size.maxWidth === 'origin'
                ? style(originBox.width)
                : style(size.maxWidth),
            height: size.height === 'origin'
                ? style(originBox.height)
                : style(size.height),
            minHeight: size.minHeight === 'origin'
                ? style(originBox.height)
                : style(size.minHeight),
            maxHeight: size.maxHeight === 'origin'
                ? style(originBox.height)
                : style(size.maxHeight),
        };
    }

    protected initializeOffsets (): { offset: Offset<number>; zone: Offset<number>; } {

        const helper = document.createElement('div');

        helper.style.position = 'absolute';
        helper.style.opacity = '0';
        helper.style.pointerEvents = 'none';

        // configured offsets can be css strings like `2rem` or `var(--grid-size)` etc.
        // we apply them to a visually hidden helper element, so we can measure them
        helper.style.top = style(this.config.safeZone?.vertical ?? 0);
        helper.style.left = style(this.config.safeZone?.horizontal ?? 0);
        helper.style.height = style(this.config.alignment.offset?.vertical ?? 0);
        helper.style.width = style(this.config.alignment.offset?.horizontal ?? 0);

        document.body.append(helper);

        const measures = helper.getBoundingClientRect();

        helper.remove();

        return {
            zone: {
                vertical: measures.top,
                horizontal: measures.left,
            },
            offset: {
                vertical: measures.height,
                horizontal: measures.width,
            },
        };
    }

    protected updatePosition (origin?: Origin, size?: Size): PositionStyles | undefined {

        if (!this.element || !this.hasAttached) return;

        this.currentOrigin = origin ?? this.currentOrigin;
        this.currentSize = size ?? this.currentSize;

        const originBox = getBoundingBox(this.currentOrigin);

        const styles = this.initializeStyles(originBox, this.currentSize);

        this.updateStyles(styles);

        const targetBox = getBoundingBox(this.element);

        const alignment = {
            origin: { ...this.config.alignment.origin },
            target: { ...this.config.alignment.target },
            offset: { ...this.offset },
        };

        if (this.config.safeZone) {

            return {
                ...styles,
                ...this.fitPosition(originBox, targetBox, alignment, this.zone),
            };

        } else {

            const targetPosition = getAlignedPosition(originBox, targetBox, alignment);

            return {
                ...styles,
                top: `${ targetPosition.y + window.scrollY }px`,
                left: `${ targetPosition.x + window.scrollX }px`,
            };
        }
    }

    protected updateStyles (styles: PositionStyles = {}): void {

        if (!this.element || !this.hasAttached) return;

        this.element.setAttribute('style', styleAttribute(styles));
    }

    protected fitPosition (originBox: BoundingBox, targetBox: BoundingBox, alignment: AlignmentPair, zone: Offset<number>): Partial<PositionStyles> {

        if (!this.element) return {};

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        targetBox = this.fitAxis(originBox, targetBox, alignment, zone, 'horizontal');
        targetBox = this.fitAxis(originBox, targetBox, alignment, zone, 'vertical');

        // limit the overlay's x position to the safe zone (the origin might be scrolled out of the safe zone)
        targetBox.x = Math.min(Math.max(targetBox.x, zone.horizontal), Math.max(viewportWidth - zone.horizontal - targetBox.width, zone.horizontal));
        targetBox.y = Math.min(Math.max(targetBox.y, zone.vertical), Math.max(viewportHeight - zone.vertical - targetBox.height, zone.vertical));

        return {
            top: `${ targetBox.y + window.scrollY }px`,
            left: `${ targetBox.x + window.scrollX }px`,
            maxWidth: this.element.style.maxWidth,
            maxHeight: this.element.style.maxHeight,
        };
    }

    protected fitAxis (originBox: BoundingBox, targetBox: BoundingBox, alignment: AlignmentPair, zone: Offset<number>, orientation: 'horizontal' | 'vertical'): BoundingBox {

        // get the initial aligned position
        let targetPosition = getAlignedPosition(originBox, targetBox, alignment);

        // we can't do any fitting if the element is not set
        if (!this.element) return { ...targetBox, ...targetPosition };

        let spaceStart = this.space(originBox, alignment, zone, orientation, 'start');
        let spaceEnd = this.space(originBox, alignment, zone, orientation, 'end');

        // how much does overlay reach into the safe zone
        const spillStart = this.spillStart({ ...targetBox, ...targetPosition }, zone, orientation);
        const spillEnd = this.spillEnd({ ...targetBox, ...targetPosition }, zone, orientation);

        if (spillStart > 0) {

            if (spaceStart < spaceEnd) {

                if (alignment.origin[orientation] === 'start' && alignment.target[orientation] === 'end') {

                    alignment.origin[orientation] = 'end';
                    alignment.target[orientation] = 'start';

                } else {

                    alignment.origin[orientation] = 'start';
                    alignment.target[orientation] = 'start';
                }

                // recalculate aligned position after alignment change
                targetPosition = getAlignedPosition(originBox, targetBox, alignment);
                // recalculate space after alignment change
                spaceEnd = this.space(originBox, alignment, zone, orientation, 'end');
                // limit the maximum size along the orientation axis to the available space
                this.element.style[orientation === 'horizontal' ? 'maxWidth' : 'maxHeight'] = style(spaceEnd);

            } else {

                // limit the maximum size along the orientation axis to the available space
                this.element.style[orientation === 'horizontal' ? 'maxWidth' : 'maxHeight'] = style(spaceStart);
            }

            targetBox = getBoundingBox(this.element);
            targetPosition = getAlignedPosition(originBox, targetBox, alignment);

        } else if (spillEnd > 0) {

            if (spaceStart > spaceEnd) {

                if (alignment.origin[orientation] === 'end' && alignment.target[orientation] === 'start') {

                    alignment.origin[orientation] = 'start';
                    alignment.target[orientation] = 'end';

                } else {

                    alignment.origin[orientation] = 'end';
                    alignment.target[orientation] = 'end';
                }

                // recalculate aligned position after alignment change
                targetPosition = getAlignedPosition(originBox, targetBox, alignment);
                // recalculate space after alignment change
                spaceStart = this.space(originBox, alignment, zone, orientation, 'start');
                // limit the maximum size along the orientation axis to the available space
                this.element.style[orientation === 'horizontal' ? 'maxWidth' : 'maxHeight'] = style(spaceStart);

            } else {

                // limit the maximum size along the orientation axis to the available space
                this.element.style[orientation === 'horizontal' ? 'maxWidth' : 'maxHeight'] = style(spaceEnd);
            }

            targetBox = getBoundingBox(this.element);
            targetPosition = getAlignedPosition(originBox, targetBox, alignment);

        } else {

            // if the element fits (no spill) we still want to apply a maximum size in order
            // to prevent any css animations from exceeding the available space
            // we do this only if no maxWidth/maxHeight has been set through the position config
            let max = this.element.style[orientation === 'horizontal' ? 'maxWidth' : 'maxHeight'];

            if (!max) {

                max = (alignment.target[orientation] === 'start')
                    ? style(spaceEnd)
                    : (alignment.target[orientation] === 'end')
                        ? style(spaceStart)
                        : max;
            }

            this.element.style[orientation === 'horizontal' ? 'maxWidth' : 'maxHeight'] = max;
        }

        return { ...targetBox, ...targetPosition };
    }

    /**
     * Calculates the available space before/after a position origin based on the alignment, safeZone and orientation.
     */
    protected space (originBox: BoundingBox, alignment: AlignmentPair, safeZone: Offset<number>, orientation: 'horizontal' | 'vertical', at: 'start' | 'end'): number {

        const viewport = (orientation === 'horizontal') ? window.innerWidth : window.innerHeight;
        const start = (orientation === 'horizontal') ? originBox.x : originBox.y;
        const self = (orientation === 'horizontal') ? originBox.width : originBox.height;

        const space = alignment.origin[orientation] === 'start'
            ? start
            : alignment.origin[orientation] === 'end'
                ? start + self
                : start + self / 2;

        return (at === 'start' ? space : viewport - space) - safeZone[orientation] - alignment.offset[orientation];
    }

    /**
     * Calculates the amount that a position target's start coordinates 'spill` over the safe zone.
     */
    protected spillStart (targetBox: BoundingBox, safeZone: Offset<number>, orientation: 'horizontal' | 'vertical'): number {

        const zone = safeZone[orientation] ?? 0;
        const start = (orientation === 'horizontal') ? targetBox.x : targetBox.y;

        return zone - start;
    }

    /**
     * Calculates the amount that a position target's end coordinates 'spill` over the safe zone.
     */
    protected spillEnd (targetBox: BoundingBox, safeZone: Offset<number>, orientation: 'horizontal' | 'vertical'): number {

        const zone = safeZone[orientation] ?? 0;
        const end = (orientation === 'horizontal') ? targetBox.x + targetBox.width : targetBox.y + targetBox.height;
        const max = (orientation === 'horizontal') ? window.innerWidth : window.innerHeight;

        return end - max + zone;
    }
}
