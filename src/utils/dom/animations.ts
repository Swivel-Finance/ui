export const animationsDone = async (element: HTMLElement, options?: GetAnimationsOptions): Promise<void> => {

    const animations = element.getAnimations({ subtree: true, ...options })
        .map(animation => animation.finished) ?? [];

    await Promise.allSettled(animations);
};
