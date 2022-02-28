import { FocusMonitor, FocusTrap } from '../../../src/behaviors/focus/index.js';
import { OverlayBehavior, OverlayTriggerBehavior, OVERLAY_CONFIG_DEFAULT, OVERLAY_CONFIG_TOOLTIP, TooltipTriggerBehavior } from '../../../src/behaviors/overlay/index.js';
import { CenteredPositionBehavior, Position, PositionBehavior, POSITION_CONFIG_CENTERED, POSITION_CONFIG_CONNECTED, POSITION_CONFIG_FULLSCREEN } from '../../../src/behaviors/position/index.js';

const configForm = document.getElementById('config') as HTMLFormElement;
const trigger = document.getElementById('overlay-trigger') as HTMLButtonElement;
const overlay = document.getElementById('overlay') as HTMLDivElement;

const triggerBehavior = new OverlayTriggerBehavior();
const overlayBehavior = new OverlayBehavior({
    triggerBehavior,
    focusBehavior: new FocusTrap(),
    positionBehavior: new PositionBehavior(),
});

const initConfig = () => {

    setConfig();

    configForm.addEventListener('change', () => {

        setConfig();
    });
};

const setConfig = () => {

    const position = (configForm.elements.namedItem('position') as HTMLSelectElement).value;

    const config = position === 'connected'
        ? { ...POSITION_CONFIG_CONNECTED }
        : position === 'centered'
            ? { ...POSITION_CONFIG_CENTERED }
            : { ...POSITION_CONFIG_FULLSCREEN };

    config.origin = position === 'connected'
        ? trigger
        : 'viewport';

    const zone = (configForm.elements.namedItem('zone') as HTMLSelectElement).value;

    config.safeZone = zone === 'line'
        ? { horizontal: 'var(--line-height)', vertical: 'var(--line-height)' }
        : zone === 'viewport'
            ? { horizontal: 0, vertical: 0 }
            : undefined;

    const offset = (configForm.elements.namedItem('offset') as HTMLSelectElement).value;

    config.alignment.offset = offset === 'line'
        ? { horizontal: 'var(--line-height)', vertical: 'var(--line-height)' }
        : undefined;

    const width = (configForm.elements.namedItem('width') as HTMLSelectElement).value;

    config.width = width === 'viewport'
        ? '50vw'
        : width === 'origin'
            ? 'origin'
            : undefined;

    const focusTrap = (configForm.elements.namedItem('focustrap') as HTMLInputElement).checked;

    const backdrop = (configForm.elements.namedItem('backdrop') as HTMLInputElement).checked;

    const animated = (configForm.elements.namedItem('animated') as HTMLInputElement).checked;

    overlayBehavior.config = {
        ...OVERLAY_CONFIG_DEFAULT,
        animated,
        backdrop,
        focusBehavior: focusTrap ? new FocusTrap() : new FocusMonitor(),
        positionBehavior: position === 'centered'
            ? new CenteredPositionBehavior(config)
            : new PositionBehavior(config),
        triggerBehavior,
    };
};

const initOverlay = () => {

    overlayBehavior.attach(overlay);
    triggerBehavior.attach(trigger, overlayBehavior);
};

const detachOverlay = () => {

    triggerBehavior.detach();
    overlayBehavior.detach();
};

const initDetachDialog = () => {

    const button = document.getElementById('overlay-detach');

    button?.addEventListener('click', detachOverlay);
};

const initTooltip = () => {

    const trigger = document.querySelector('.container p > a') as HTMLElement;
    const overlay = document.querySelector('.container .tooltip') as HTMLElement;

    const overlayTrigger = new TooltipTriggerBehavior();

    const overlayBehavior = new OverlayBehavior({
        ...OVERLAY_CONFIG_TOOLTIP,
        animated: true,
        triggerBehavior: overlayTrigger,
        positionBehavior: new PositionBehavior({
            ...POSITION_CONFIG_CONNECTED,
            origin: trigger,
            alignment: {
                origin: {
                    horizontal: 'center',
                    vertical: 'start',
                },
                target: {
                    horizontal: 'center',
                    vertical: 'end',
                },
                offset: {
                    vertical: 'var(--line-height)',
                },
            },
            safeZone: {
                horizontal: 'var(--line-height)',
                vertical: 'var(--line-height)',
            },
        }),
    });

    overlayBehavior.attach(overlay);
    overlayTrigger.attach(trigger, overlayBehavior);
};

const initPointer = () => {

    const overlay = document.querySelector('.container .pointer') as HTMLElement;

    let position: Position = {
        x: 0,
        y: 0,
    };

    const positionBehavior = new PositionBehavior({
        ...POSITION_CONFIG_CONNECTED,
        origin: position,
        alignment: {
            origin: {
                horizontal: 'center',
                vertical: 'start',
            },
            target: {
                horizontal: 'center',
                vertical: 'end',
            },
            offset: {
                vertical: 'var(--line-height)',
            },
        },
        safeZone: {
            horizontal: 'var(--line-height)',
            vertical: 'var(--line-height)',
        },
    });

    const overlayBehavior = new OverlayBehavior({
        ...OVERLAY_CONFIG_TOOLTIP,
        animated: true,
        positionBehavior,
    });

    overlayBehavior.attach(overlay);

    document.addEventListener('mousemove', event => {

        if (!positionBehavior.hasAttached) return;

        position = { x: event.clientX, y: event.clientY };

        void positionBehavior.requestUpdate(position);
    });

    const togglePointerTip = () => {

        void overlayBehavior.toggle();

        void positionBehavior.requestUpdate(position);
    };

    const button = document.getElementById('pointer-toggle');

    button?.addEventListener('click', togglePointerTip);
};

const initNestedOverlay = (id: string) => {

    const trigger = document.getElementById(`${ id }-trigger`) as HTMLButtonElement;
    const overlay = document.getElementById(id) as HTMLDivElement;

    const triggerBehavior = new OverlayTriggerBehavior();
    const overlayBehavior = new OverlayBehavior({
        triggerBehavior,
        focusBehavior: new FocusTrap(),
        positionBehavior: new PositionBehavior({
            ...POSITION_CONFIG_CONNECTED,
            origin: trigger,
        }),
    });

    overlayBehavior.attach(overlay);
    triggerBehavior.attach(trigger, overlayBehavior);
};

const initNestedNestedOverlay = (id: string) => {

    const trigger = document.getElementById(`${ id }-trigger`) as HTMLButtonElement;
    const overlay = document.getElementById(id) as HTMLDivElement;

    const triggerBehavior = new OverlayTriggerBehavior();
    const overlayBehavior = new OverlayBehavior({
        backdrop: true,
        triggerBehavior,
        focusBehavior: new FocusTrap(),
        positionBehavior: new PositionBehavior(),
    });

    overlayBehavior.attach(overlay);
    triggerBehavior.attach(trigger, overlayBehavior);
};

initConfig();
initOverlay();
initDetachDialog();
initTooltip();
initPointer();
initNestedOverlay('nested-overlay');
initNestedOverlay('nested-overlay-2');
initNestedNestedOverlay('nested-nested-overlay');
initNestedNestedOverlay('nested-nested-overlay-2');
