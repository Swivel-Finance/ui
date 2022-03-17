export interface AnimationsDoneOptions extends GetAnimationsOptions {
    /**
     * Include animations from decendants of the element.
     */
    subtree: boolean;
    /**
     * Exclude infinite animations from being awaited.
     */
    excludeInfinite: boolean;
    /**
     * Exclude selected elements from awaited animations/transitions.
     *
     * @remarks
     * Provide CSS selector(s) to match animation targets against when awaiting animations
     * to settle. Animations from matched targets will be excluded.
     */
    excludeElements?: string | string[];
}

export const ANIMATIONS_DONE_OPTIONS_DEFAULT: AnimationsDoneOptions = {
    subtree: true,
    excludeInfinite: true,
};

export const animationsDone = async (element: HTMLElement, options?: Partial<AnimationsDoneOptions>): Promise<void> => {

    const config = { ...ANIMATIONS_DONE_OPTIONS_DEFAULT, ...options };

    const selector = config.excludeElements
        ? config.excludeElements instanceof Array
            ? config.excludeElements.join(',')
            : config.excludeElements
        : undefined;

    const excludedElements = selector
        ? Array.from(element.querySelectorAll(selector))
        : undefined;

    const excludeElements = !!excludedElements && excludedElements.length > 0;
    const excludeInfinite = config.excludeInfinite;

    const filter = excludeElements || excludeInfinite
        ? (animation: Animation) => {
            let excluded = false;
            // optionally exclude infinite animations
            excluded = excluded || excludeInfinite && animation.effect?.getTiming().iterations === Infinity;
            // optionally exclude animations from excluded elements
            excluded = excluded || excludeElements && excludedElements.some(element => element.contains((animation.effect as KeyframeEffect)?.target));
            return !excluded;
        }
        : undefined;

    const animations = element.getAnimations((config));

    await Promise.allSettled((filter ? animations.filter(filter) : animations).map(animation => animation.finished));
};
