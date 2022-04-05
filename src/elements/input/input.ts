import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { dispatch } from '../../utils/events/index.js';
import { ValueChangeEvent } from './events.js';

/**
 * A base class for input-like elements.
 *
 * @remarks
 * This element is a base class and should be extended, rather than used directly.
 * It is not registered with the `custemElements` registry and has no tag name.
 * It provides a reactive `value` property, a default `valueChange` change detector
 * and a `dispatchValueChange` method to standardize/simplify value and event handling
 * for input-like elements.
 */
export class InputElement<T = unknown> extends LitElement {

    protected _currentValue = undefined as unknown as T;

    protected _previousValue = undefined as unknown as T;

    @property()
    set value (value: T) {

        this._previousValue = this._currentValue;

        this._currentValue = value;
    }

    get value (): T {

        return this._currentValue;
    }

    @property()
    valueChange = (current: T, previous: T): boolean => current !== previous;

    protected hasValueChanged (): boolean {

        return this.valueChange(this._currentValue, this._previousValue);
    }

    protected dispatchValueChange (): void {

        const event = new ValueChangeEvent({
            target: this,
            previous: this._previousValue,
            current: this._currentValue,
            change: this.hasValueChanged(),
        });

        dispatch(this, event);
    }
}
