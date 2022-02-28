import { setAttribute } from './dom.js';

export class AttributeManager {

    protected attributes = new Map<string, string | null | undefined>();

    constructor (protected element: HTMLElement) { }

    set (attribute: string, value: string | number | boolean | null | undefined): void {

        if (!this.attributes.has(attribute)) {

            this.store(attribute);
        }

        setAttribute(this.element, attribute, value);
    }

    store (attribute: string): void {

        this.attributes.set(attribute, this.element.getAttribute(attribute));
    }

    restore (attribute: string): void {

        setAttribute(this.element, attribute, this.attributes.get(attribute));

        this.attributes.delete(attribute);
    }

    restoreAll (): void {

        this.attributes.forEach((value, key) => this.restore(key));
    }
}
