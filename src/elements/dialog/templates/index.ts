import { html, nothing, TemplateResult } from 'lit';
import { DialogElement } from '../dialog.js';

export const dialogHeader = (dialog: DialogElement | string, title: string): TemplateResult => {

    const id = dialog instanceof DialogElement
        ? dialog.id
        : dialog;

    return html`
    <header class="ui-dialog-header">
        ${ title ? html`<h2 class="ui-dialog-title" id="${ id }-title">${ title }</h2>` : nothing }
        <button type="button" aria-label="close dialog" data-command="dismiss">
            <ui-icon name="times"></ui-icon>
        </button>
    </header>
    `;
};

/**
 * Create a footer template for the `ui-dialog` element.
 *
 * @remarks
 * Your template may contain clickable elements with a `data-command` attribute of the
 * values: `'dismiss'` | `'cancel'` | `'confirm'`. These elements will be automatically
 * bound by the `ui-dialog` element to call the corrsponding method on the dialog instance.
 *
 * If you want to bind your own event handlers, don't set these attribute values.
 */
export const dialogFooter = (content: TemplateResult): TemplateResult => {

    return html`
    <footer class="ui-dialog-footer">
        ${ content ? content : nothing }
    </footer>
    `;
};

/**
 * Create a content template for the `ui-dialog` element.
 *
 * @remarks
 * Your template may contain clickable elements with a `data-command` attribute of the
 * values: `'dismiss'` | `'cancel'` | `'confirm'`. These elements will be automatically
 * bound by the `ui-dialog` element to call the corrsponding method on the dialog instance.
 *
 * If you want to bind your own event handlers, don't set these attribute values.
 */
export const dialogContent = (content: TemplateResult): TemplateResult => {

    return html`
    <div class="ui-dialog-content">
        ${ content ? content : nothing }
    </div>
    `;
};
