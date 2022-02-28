import { FocusMonitor, FocusTrap } from '../../../src/behaviors/focus/index.js';

const log = (content: string, element: HTMLElement) => {

    element.innerHTML = content;
};

const initFocusMonitor = () => {

    const root = document.querySelector('.focus-monitor') as HTMLDivElement;
    const panel = root.querySelector('.panel.left') as HTMLDivElement;
    const output = root.querySelector('.output') as HTMLDivElement;

    const focusMonitor = new FocusMonitor();
    focusMonitor.attach(panel);

    panel.addEventListener('ui-focus-changed', event => {

        const detail = event.detail;

        const content = `${ (event.timeStamp / 1000).toFixed(1) }s \n${ event.type }: ${ detail.hasFocus ? 'focused' : 'not focused' }\ntarget: #${ detail.target.id }\nrelatedTarget: #${ detail.relatedTarget?.id ?? 'undefined' }`;

        log(content, output);

        console.log(event);
    });
};

const initFocusTrap = () => {

    const root = document.querySelector('.focus-trap') as HTMLDivElement;
    const buttonLeft = root.querySelector('.attach-focus-trap.left') as HTMLButtonElement;
    const buttonRight = root.querySelector('.attach-focus-trap.right') as HTMLButtonElement;
    const panelLeft = root.querySelector('.panel.left') as HTMLDivElement;
    const panelRight = root.querySelector('.panel.right') as HTMLDivElement;

    const focusTrapLeft = new FocusTrap();
    const focusTrapRight = new FocusTrap();

    let attachedLeft = false;
    let attachedRight = false;

    buttonLeft.addEventListener('click', () => {
        attachedLeft = !attachedLeft;
        attachedLeft
            ? focusTrapLeft.attach(panelLeft)
            : focusTrapLeft.detach();
    });

    buttonRight.addEventListener('click', () => {
        attachedRight = !attachedRight;
        attachedRight
            ? focusTrapRight.attach(panelRight)
            : focusTrapRight.detach();
    });
};

initFocusMonitor();
initFocusTrap();
