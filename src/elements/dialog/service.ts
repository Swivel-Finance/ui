import { DialogElement } from './dialog.js';

export class DialogService {

    protected dialogs = new Map<DialogElement, { remove: boolean; }>();

    async show (dialog: DialogElement): Promise<void> {

        if (!this.dialogs.has(dialog)) {

            // if the dialog isn't already connected, we're probably dealing with
            // an in-flight dialog instance that should be removed after hiding
            this.dialogs.set(dialog, { remove: !dialog.isConnected });
        }

        if (!dialog.isConnected) {

            document.body.append(dialog);

            // wait for the dialog to initially render before showing it
            await dialog.updateComplete;
        }

        await dialog.show();
    }

    async hide (dialog: DialogElement): Promise<void> {

        await dialog.hide();

        if (this.dialogs.has(dialog)) {

            // remove in-flight dialog instances from the DOM
            if (this.dialogs.get(dialog)?.remove) {

                dialog.remove();
            }

            this.dialogs.delete(dialog);
        }
    }

    async prompt<T = unknown> (dialog: DialogElement<T>): Promise<T | undefined> {

        await this.show(dialog);

        return new Promise(resolve => {

            dialog.addEventListener('ui-dialog-result', event => {

                void this.hide(event.detail.target);

                resolve(event.detail.result);

            }, { once: true });
        });
    }
}

export const dialogs = new DialogService();
