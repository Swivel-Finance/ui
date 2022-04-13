import { html, nothing, TemplateResult } from 'lit';

/**
 * Creates a template for a unit string.
 *
 * @param u - the unit to render, e.g. '%'
 * @returns a `lit.TemplateResult` for the unit
 */
export const unit = (u: string): TemplateResult => html`<span class="unit">${ u }</span>`;

/**
 * Creates a template for an amount with an optional unit.
 *
 * @param a - the amount to render
 * @param u - an optional unit to render
 * @returns a `lit.TemplateResult` for the amount
 */
export const amount = (a: string, u?: string): TemplateResult =>
    html`<span class="amount"><span class="value">${ a }</span>${ u ? unit(u) : '' }</span>`;

/**
 * Creates a template for an amount label with an optional unit.
 *
 * @param l - the label to render
 * @param u - an optional unit to render
 * @returns a `lit.TemplateResult` for the amount label
 */
export const amountLabel = (l: string, u?: string): TemplateResult =>
    html`<span class="amount"><span class="label">${ l }</span>${ u ? unit(u) : '' }</span>`;

/**
 * Creates a template for a token's symbol.
 *
 * @param t - the token to render
 * @returns a `lit.TemplateResult` for the token symbol
 */
export const tokenSymbol = (t?: string): TemplateResult | typeof nothing =>
    t ? html`<span class="unit token-symbol">${ t }</span>` : nothing;

/**
 * Creates a template for a token amount.
 *
 * @param a - the amount to render
 * @param t - the token to render
 * @returns a `lit.TemplateResult` for the token amount including the token symbol
 */
export const tokenAmount = (a: string, t?: string): TemplateResult =>
    html`<span class="token-amount">${ amount(a) }${ tokenSymbol(t) }</span>`;
