import { AnimationsDoneOptions } from '../../../utils/dom/index.js';
import { ClassNames, CLASS_MAP } from '../../utils/index.js';

export interface BackdropConfig {
    classes: Record<ClassNames, string>;
    animated: boolean;
    animationOptions?: Partial<AnimationsDoneOptions>;
}

export const BACKDROP_CONFIG_DEFAULT: BackdropConfig = {
    classes: CLASS_MAP,
    animated: true,
};
