import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { dialogContent, DialogElement, dialogFooter, dialogHeader, DialogResultEvent } from '../../../src/elements/dialog/index.js';
import { FeedbackResult } from './input-dialog.js';
import '../../../src/elements/dialog/dialog.js';
import '../../../src/elements/icon/icon.js';
import './input-dialog.js';

const template = function (this: DialogDemoElement) {

    return html`

    <h3>Embedded Dialog</h3>

    <div class="container">

        <p>
            In its simplest form you can wire up a dialog by placing a button and a <code>ui-dialog</code> element
            inside your template. To populate the dialog, you can use the aforementioned templates:
        </p>
        <pre>
    ${ `
    <button type="button" aria-controls="embedded-dialog">Show Dialog</button>

    <ui-dialog
        id="embedded-dialog"
        .result=\${ true }
        @ui-dialog-result=\${ event => handleTheResult(event.detail.result) }>

        \${ dialogHeader('embedded-dialog', 'Alert') }

        \${ dialogContent(html\`
            <p>Something important happened</p>
        \`) }

        \${ dialogFooter(html\`
            <button type="button" data-command="cancel">Cancel</button>
            <button type="button" class="primary" data-command="confirm">Ok</button>
        \`) }

    </ui-dialog>` }
        </pre>

        <p>
            This can be useful for alert-dialogs or simple confirmation-style dialogs that don't require additional
            user input. Notice the <code>data-command</code> attribute on the footer buttons:
        </p>
        <ul>
            <li>
                The <code>data-command</code> attribute supports 3 values: <code>confirm</code> | <code>cancel</code> |
                <code>dismiss</code>
            </li>
            <li>
                The attribute can be attached to any clickable element inside a dialog template
            </li>
            <li>
                Elements inside a dialog using the <code>data-command</code> attribute will be automatically bound
                and invoke the corresponding API method on the <code>DialogElement</code> instance when clicked
            </li>
        </ul>
        <p>
            This simplifies the creation of embedded dialogs, as we can author simple buttons which will invoke the
            <code>ui-dialogs</code>'s methods without having a reference to the dialog instance itself. The obvious
            limitation is that we can't run any custom logic using this method.
        </p>
        <p>
            Also notice the <code>.result</code> property binding on the <code>ui-dialog</code>:
        </p>
        <ul>
            <li>
                By using a simple <code>boolean</code> result, we can listen to the dialog's
                <code>ui-dialog-result</code> event and determine if a user confirmed or otherwise closed the dialog
            </li>
        </ul>

        <div class="container">

            <button type="button" aria-controls="embedded-dialog">Show Dialog</button>

            <ui-dialog id="embedded-dialog" .result=${ true } @ui-dialog-result=${ this.handleConfirmation }>
                ${ dialogHeader('embedded-dialog', 'Alert') }
                ${ dialogContent(html`
                    <p>Something important happened</p>
                `) }
                ${ dialogFooter(html`
                    <button type="button" data-command="cancel">Cancel</button>
                    <button type="button" class="primary" data-command="confirm">Ok</button>
                `) }
            </ui-dialog>

        </div>

    </div>

    <h3>Standalone Dialog</h3>

    <div class="container">

        <p>
            In order to capture user input, you'll likely need additional dialog controls, like emitting a result
            from a <code>ui-dialog</code> or closing it and resetting its inputs. Most commonly, such interactions
            would be implemented in the dialog's content or footer area. As these interactions depend on your specific
            needs, you will have to implement them in either a host component or, more flexibly, by creating a custom
            dialog element, which encapsulates the entire dialog functionality in a re-usable element.
        </p>

        <div class="container">

            <button type="button" aria-controls="demo-input-dialog">Give Feedback</button>

            <demo-input-dialog
                id="demo-input-dialog"
                @ui-dialog-result=${ (e: DialogResultEvent<FeedbackResult>) => this.handleFeedback(e) }>
            </demo-input-dialog>
        </div>
    </div>
    `;
};

@customElement('demo-dialog')
export class DialogDemoElement extends LitElement {

    protected inputDialog = createRef<DialogElement>();

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return template.apply(this);
    }

    protected handleConfirmation (event: DialogResultEvent<boolean>): void {

        console.log('handleConfirmation... ', event.detail.result);
    }

    protected handleFeedback (event: DialogResultEvent<FeedbackResult>): void {

        console.log('handleFeedback... ', event.detail.result);
    }
}
