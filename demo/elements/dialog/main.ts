import { html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { OverlayConfig } from '../../../src/behaviors/overlay/index.js';
import { dialogContent, DialogElement, dialogFooter, dialogHeader, DialogResultEvent, dialogs } from '../../../src/elements/dialog/index.js';
import { FeedbackDialog, FeedbackResult } from './feedback-dialog.js';
import '../../../src/elements/dialog/dialog.js';
import '../../../src/elements/icon/icon.js';
import './feedback-dialog.js';

const codeExampleStandalone = `
    export interface FeedbackResult {
        name: string;
        rating: number;
    }

    const template = function (this: FeedbackDialog) {

        return html\`
        \${ dialogHeader(this, 'Feedback') }
        \${ dialogContent(html\`...\`) }
        \${ dialogFooter(html\`
            <button type="button" @click=\${ () => this.cancel(true) }>Cancel</button>
            <button type="button" @click=\${ () => this.confirm(true) }>Ok</button>
        \`) }
        \`;
    };

    @customElement('feedback-dialog')
    export class FeedbackDialog extends DialogElement<FeedbackResult> {

        protected render (): unknown {
            return template.apply(this);
        }

        protected handleFormLogic () {
            // deal with form submission, input and change events, validation, ...
        }
    }
`;

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
                <code>ui-dialog-result</code> event and determine if a user <br/>
                confirmed the dialog
                <em> - <code>event.detail.result</code> will be <code>true</code></em><br/>
                or otherwise closed the dialog
                <em> - <code>event.detail.result</code> will be <code>undefined</code></em>
            </li>
        </ul>

        <div class="container horizontal half">

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

            <div class="container">

                <label>DialogResultEvent:</label>

                <pre style="padding:var(--line-height);">${ this.embeddedDialogResult
                    ? JSON.stringify({
                        type: this.embeddedDialogResult.type,
                        detail: {
                            ...this.embeddedDialogResult.detail,
                            target: `[${this.embeddedDialogResult.detail.target.nodeName}]`,
                        }
                    }, undefined, 4)
                    : nothing
                }</pre>

                ${ this.embeddedDialogResult
                    ? html`<p>Dialog was ${ this.embeddedDialogResult.detail.result
                        ? html`<code>confirmed</code>`
                        : html`<code>dismissed | canceled | closed</code>`
                    }</p>`
                    : nothing
                }
            </div>

        </div>

    </div>

    <h3>Standalone Dialog</h3>

    <div class="container">

        <p>
            If a dialog needs to do more than just display information, a simple embedded <code>ui-dialog</code> like
            in the previous example will likely not be enough. Any custom logic, like input validation, data fetching,
            form resets, or similar will need to be written in some host element. You <em>could</em> add this logic to
            your parent element, but this will quickly become messy and make the dialog less <strong>portable</strong>.
        </p>

        <p>
            The recommended way to approach this is creating a custom element which extends the
            <code>DialogElement</code> and encapsulates all its logic in a single, re-usable element:
        </p>

        <pre>
    ${ codeExampleStandalone }
        </pre>

        <p>
            For implementation details of this example, refer to <code>demo/elements/dialog/feedback-dialog.ts</code>.
        </p>

        <p>
            To use a standalone dialog in a parent element, make sure the element module is imported somewhere in
            either your parent element or your main file (<code>import './path/to/feedback-dialog.js';</code>) and
            add the element to your template, like you would with an embedded dialog:
        </p>

        <pre><xmp>
    <button type="button" aria-controls="feedback-dialog">Give Feedback</button>

    <feedback-dialog
        id="feedback-dialog"
        @ui-dialog-result=\${ event => this.handleFeedback(event) }>
    </feedback-dialog>
        </xmp></pre>

        <div class="container horizontal half">

            <div class="container">

                <button type="button" aria-controls="feedback-dialog">Give Feedback</button>

                <feedback-dialog
                    id="feedback-dialog"
                    @ui-dialog-result=${ (e: DialogResultEvent<FeedbackResult>) => this.handleFeedback(e) }>
                </feedback-dialog>

            </div>

            <div class="container">

                <label>DialogResultEvent:</label>

                <pre style="padding:var(--line-height);">${ this.feedbackDialogResult
                    ? JSON.stringify({
                        type: this.feedbackDialogResult.type,
                        detail: {
                            ...this.feedbackDialogResult.detail,
                            target: `[${this.feedbackDialogResult.detail.target.nodeName}]`,
                        }
                    }, undefined, 4)
                    : nothing
                }</pre>

                ${ this.feedbackDialogResult
                    ? html`<p>Dialog was ${ this.feedbackDialogResult.detail.result
                        ? html`<code>confirmed</code>`
                        : html`<code>dismissed | canceled | closed</code>`
                    }</p>`
                    : nothing
                }
            </div>
        </div>
    </div>

    <h3>Dialog Service</h3>

    <div class="container">

        <p>
            Finally, the dialog module exports a singleton <code>DialogService</code> instance, which can be used to
            programmatically control dialogs, e.g. when a dialog needs to be shown as part of an automated user flow
            or as a reaction to some asynchronous event, like a failed network request. in these cases you won't
            usually have a button to bind a dialog to and you typically want to initiate the dialog without user
            interactions.
        </p>

        <p>
            The <code>DialogService</code> has a simple API, but should be sufficient for most use cases:
        </p>

        <ul>
            <li>
                <code>show (dialog: DialogElement)</code>: Shows the specified dialog instance and returns a Promise
                which will resolve once the dialog is shown<br>
                <em>Will append the dialog to the DOM if it's not already connected</em>
            </li>
            <li>
                <code>hide (dialog: DialogElement)</code>: Hides the specified dialog instance and returns a Promise
                which will resolve once the dialog is hidden<br>
                <em>Will remove the dialog from the DOM if it wasn't connected before showing</em>
            </li>
            <li>
                <code>prompt &lt;T&gt;(dialog: DialogElement&lt;T&gt;)</code>: Shows and hides the specified dialog
                instance and returns a <code>Promise&lt;T&gt;</code> which will resolve with the
                <code>DialogResultEvent</code>'s <code>result</code> property once the dialog is closed by the user<br>
            </li>
        </ul>

        <p>
            To use the <code>DialogService</code>, import it to whereever you need it (it doesn't have to be used
            inside an element, but can be used in state machines, services, or anywhere really):
        </p>

        <pre><xmp>
    import { dialogs } from '@swivel-finance/ui/elements/dialog';
        </xmp></pre>

        <p>
            Next, invoke the <code>DialogService</code> and pass it a <code>DialogElement</code> instance to handle.
            At this point you can probably see why it is handy to create standalone dialog elements, as you can re-use
            them in multiple ways. For this example, we can use our <code>FeedbackDialog</code> from earlier.
            Where exactly you want to invoke the <code>DialogService</code> depends on your specific use case,
            but let's assume we encapsulate this call in a helper function:
        </p>

        <pre><xmp>
    protected async invokeDialogService (): Promise<void> {

        // invoke the DialogService singleton
        const result = await dialogs.prompt(new FeedbackDialog());

        // now do what you like with the result...
    }
        </xmp></pre>

        <p>
            And that's it. You can try out this example below:
        </p>

        <div class="container horizontal half">

            <div class="container">

                <button type="button" @click=${ () => this.invokeDialogService() }>Invoke Dialog Service</button>

            </div>

            <div class="container">

                <label><code>DialogService.prompt()</code> result:</label>

                <pre style="padding:var(--line-height);">${ this.serviceResult
                    ? JSON.stringify(this.serviceResult, undefined, 4)
                    : nothing
                }</pre>
            </div>

        </div>

    </div>

    <h3>Dialog Configuration</h3>

    <div class="container">

        <p>
            Dialogs can be configured with an <code><a href="../../behaviors/overlay/">OverlayConfig</a></code> (a dialog
            is essentially just an overlay) and therefore support configuration options, like:
        </p>

        <div class="horizontal half">

            <div class="container">
                <ul>
                    <li>
                        <code>modal</code>
                        <input type="checkbox" .checked=${ this.modal } @change=${ (event: Event) => this.modal = !this.modal }>
                    </li>
                    <li>
                        <code>animated</code>
                        <input type="checkbox" .checked=${ this.animated } @change=${ (event: Event) => this.animated = !this.animated }>
                    </li>
                    <li>
                        <code>backdrop</code>
                        <input type="checkbox" .checked=${ this.backdrop } @change=${ (event: Event) => this.backdrop = !this.backdrop }>
                    </li>
                    <li>
                        <code>closeOnEscape</code>
                        <input type="checkbox" .checked=${ this.closeOnEscape } @change=${ (event: Event) => this.closeOnEscape = !this.closeOnEscape }>
                    </li>
                    <li>
                        <code>closeOnFocusLoss</code>
                        <input type="checkbox" .checked=${ this.closeOnFocusLoss } @change=${ (event: Event) => this.closeOnFocusLoss = !this.closeOnFocusLoss }>
                    </li>
                    <li>
                        <code>closeOnBackdropClick</code>
                        <input type="checkbox" .checked=${ this.closeOnBackdropClick } @change=${ (event: Event) => this.closeOnBackdropClick = !this.closeOnBackdropClick }>
                    </li>
                </ul>
            </div>

            <div class="container">

                <button type="button" aria-controls="config-dialog">Show Configured Dialog</button>

                <ui-dialog id="config-dialog" .config=${ this.getConfig() }>
                    ${ dialogHeader('config-dialog', 'Try different configurations') }
                    ${ dialogContent(html`
                        <p>Change the configuration values and re-open the dialog to see the effect of each option.</p>
                    `) }
                    ${ dialogFooter(html`
                        <button type="button" data-command="confirm">Ok</button>
                    `) }
                </ui-dialog>

            </div>

        </div>

        <p>
            Alternatively, you can choose a couple of useful configuration presets from the dialog module, like
            <code>DIALOG_CONFIG_MODAL</code> or <code>DIALOG_CONFIG_NON_MODAL</code>. A modal dialog prevents a user
            from interacting with the rest of the page until the dialog is explicitly closed, while a non-modal dialog
            will close automatically when the user interacts with content outside of the dialog.
        </p>

    </div>
    `;
};

@customElement('demo-dialog')
export class DialogDemoElement extends LitElement {

    protected inputDialog = createRef<DialogElement>();

    @state()
    protected embeddedDialogResult?: DialogResultEvent;

    @state()
    protected feedbackDialogResult?: DialogResultEvent;

    @state()
    protected serviceResult?: FeedbackResult;

    @state()
    protected modal = true;

    @state()
    protected animated = true;

    @state()
    protected backdrop = true;

    @state()
    protected closeOnEscape = true;

    @state()
    protected closeOnFocusLoss = true;

    @state()
    protected closeOnBackdropClick = true;

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return template.apply(this);
    }

    protected handleConfirmation (event: DialogResultEvent<boolean>): void {

        this.embeddedDialogResult = event;
    }

    protected handleFeedback (event: DialogResultEvent<FeedbackResult>): void {

        this.feedbackDialogResult = event;
    }

    protected async invokeDialogService (): Promise<void> {

        const result = await dialogs.prompt(new FeedbackDialog());

        this.serviceResult = result;
    }

    protected getConfig (): Partial<OverlayConfig> {

        return {
            modal: this.modal,
            animated: this.animated,
            backdrop: this.backdrop,
            closeOnEscape: this.closeOnEscape,
            closeOnFocusLoss: this.closeOnFocusLoss,
            closeOnBackdropClick: this.closeOnBackdropClick,
        };
    }
}
