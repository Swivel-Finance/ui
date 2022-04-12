import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { dispatch } from '../../utils/events/index.js';
import { Constructor } from '../../utils/index.js';
import { ValueChangeEvent } from './events.js';

/**
 * An interface for input mixin element.
 *
 * @remarks
 * This is solely a class declaration for TypeScript
 */
export declare class InputElement<V = unknown> extends LitElement {

    protected _currentValue: V;

    protected _previousValue: V;

    value: V;

    valueChange: (current: V, previous: V) => boolean;

    protected hasValueChanged (): boolean;

    protected dispatchValueChange (): void;
}

/**
 * A mixin for input-like elements.
 *
 * @remarks
 * This mixin provides a reactive `value` property, a default `valueChange` change detector
 * and a `dispatchValueChange` method to standardize/simplify value and event handling
 * for input-like elements.
 *
 * @example
 * Use this mixin by applying it to an element's base class
 * ```typescript
 * @customElement('my-element')
 * export class MyElement extends MixinInput(LitElement) { }
 * ```
 */
export const MixinInput = <V = unknown, T extends Constructor<LitElement> = Constructor<LitElement>> (BaseElement: T): Constructor<InputElement<V>> & T => {

    class InputMixinElement extends BaseElement {

        protected _currentValue = undefined as unknown as V;

        protected _previousValue = undefined as unknown as V;


        @property({ attribute: false })
        set value (value: V) {

            this._previousValue = this._currentValue;

            this._currentValue = value;

            this.requestUpdate('value', this._previousValue);
        }

        get value (): V {

            return this._currentValue;
        }

        @property({ attribute: false })
        valueChange = (current: V, previous: V): boolean => current !== previous;

        protected hasValueChanged (): boolean {

            return this.valueChange(this._currentValue, this._previousValue);
        }

        protected dispatchValueChange (): void {

            const event = new ValueChangeEvent({
                target: this as unknown as InputElement<V> & InstanceType<T>,
                previous: this._previousValue,
                current: this._currentValue,
                change: this.hasValueChanged(),
            });

            dispatch(this, event);
        }
    }

    return InputMixinElement as unknown as Constructor<InputElement<V>> & T;
};
