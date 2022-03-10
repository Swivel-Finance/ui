export interface Token {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image?: string;
    minPrincipal?: string;
}

export interface CToken extends Token {
    exchangeRate?: string;
    supplyRatePerBlock?: string;
}

export type TokenType = 'underlying' | 'nToken' | 'zcToken';

export interface Protocol {
    name: string;
    symbol: string;
    image: string;
}

export interface MarketLike {
    underlying: string;
    maturity: string;
}

export interface Market {
    underlying: string;
    maturity: string;
    tokens: {
        underlying: Token;
        cToken: CToken;
        zcToken: Token;
        nToken: Token;
    };
    vault: string;
    protocol: Protocol;
    exchangeRate?: string;
    supplyRate?: string;
    lastTradePrice?: string;
}

export const SECONDS_PER_DAY = 86_400;

export const DEFAULT_LOCALE = 'en-US';

/**
 * Creates a string identifying a market
 *
 * @remarks
 * Concatenates the market's `underlying` and `maturity` to create a unique identifier.
 *
 * @param m - market
 */
export const marketKey = (m: MarketLike): string => {

    return `${ m.underlying }-${ m.maturity }`;
};

/**
 * Returns the `underlying` and `maturity` from a market key
 *
 * @param k - market key
 */
export const fromMarketKey = (k: string): MarketLike => {

    const [underlying, maturity] = k.split('-');

    return { underlying, maturity };
};

/**
 * Locale dependent date formatters for maturity dates.
 */
export const MATURITY_DATE_FORMAT = {
    LONG: new Intl.DateTimeFormat(DEFAULT_LOCALE, { dateStyle: 'long' }),
    MEDIUM: new Intl.DateTimeFormat(DEFAULT_LOCALE, { dateStyle: 'medium' }),
    SHORT: new Intl.DateTimeFormat(DEFAULT_LOCALE, { dateStyle: 'short' }),
};

/**
 * Formats a maturity timestamp as human-readable date.
 *
 * @param m - maturity in seconds
 * @param f - optional `Intl.DateTimeFormat`
 */
export const maturityDate = (m: string, f = MATURITY_DATE_FORMAT.LONG): string => {

    const date = new Date(parseInt(m) * 1000);

    return f.format(date);
};

/**
 * Gets the number of days until maturity.
 *
 * @param m - maturity
 */
export const maturityDays = (m: string): number => {

    return Math.round(timeUntilMaturity(m) / SECONDS_PER_DAY);
};

/**
 * Gets the number of seconds until maturity.
 *
 * @param m - maturity
 */
export const timeUntilMaturity = (m: string): number => {

    const now = Date.now() / 1000;
    const maturity = parseInt(m);

    return Math.round(maturity - now);
};


export const MARKET_MOCKS: Market[] = [
    {
        underlying: '0xDAI',
        maturity: '1648162800',
        tokens: {
            underlying: {
                address: '0xDAI',
                name: 'DAI',
                symbol: 'DAI',
                decimals: 18,
                image: 'dai',
            },
            nToken: {
                address: '0xnDAI',
                name: 'nDAI',
                symbol: 'nDAI',
                decimals: 18,
            },
            zcToken: {
                address: '0xzcDAI',
                name: 'zcDAI',
                symbol: 'zcDAI',
                decimals: 18,
            },
            cToken: {
                address: '0xzcDAI',
                name: 'zcDAI',
                symbol: 'zcDAI',
                decimals: 18,
            },
        },
        vault: '0xVAULT',
        protocol: {
            name: 'Compound',
            symbol: 'COMP',
            image: 'compound',
        },
        exchangeRate: '0.02',
        supplyRate: '0.0216',
        lastTradePrice: '0.031',
    },
    {
        underlying: '0xUSDC',
        maturity: '1650844800',
        tokens: {
            underlying: {
                address: '0xUSDC',
                name: 'USDC',
                symbol: 'USDC',
                decimals: 6,
                image: 'usdc',
            },
            nToken: {
                address: '0xnUSDC',
                name: 'nUSDC',
                symbol: 'nUSDC',
                decimals: 6,
            },
            zcToken: {
                address: '0xzcUSDC',
                name: 'zcUSDC',
                symbol: 'zcUSDC',
                decimals: 6,
            },
            cToken: {
                address: '0xzcUSDC',
                name: 'zcUSDC',
                symbol: 'zcUSDC',
                decimals: 6,
            },
        },
        vault: '0xVAULT',
        protocol: {
            name: 'Compound',
            symbol: 'COMP',
            image: 'compound',
        },
        exchangeRate: '0.018',
        supplyRate: '0.015',
        lastTradePrice: '0.021',
    },
    {
        underlying: '0xUSDC',
        maturity: '1656021600',
        tokens: {
            underlying: {
                address: '0xUSDC',
                name: 'USDC',
                symbol: 'USDC',
                decimals: 6,
                image: 'usdc_alt',
            },
            nToken: {
                address: '0xnUSDC',
                name: 'nUSDC',
                symbol: 'nUSDC',
                decimals: 6,
            },
            zcToken: {
                address: '0xzcUSDC',
                name: 'zcUSDC',
                symbol: 'zcUSDC',
                decimals: 6,
            },
            cToken: {
                address: '0xzcUSDC',
                name: 'zcUSDC',
                symbol: 'zcUSDC',
                decimals: 6,
            },
        },
        vault: '0xVAULT',
        protocol: {
            name: 'Rari',
            symbol: 'RARI',
            image: 'rari',
        },
        exchangeRate: '0.02',
        supplyRate: '0.0135',
    },
    {
        underlying: '0xDAI',
        maturity: '1656021600',
        tokens: {
            underlying: {
                address: '0xDAI',
                name: 'DAI',
                symbol: 'DAI',
                decimals: 18,
                image: 'dai_alt',
            },
            nToken: {
                address: '0xnDAI',
                name: 'nDAI',
                symbol: 'nDAI',
                decimals: 18,
            },
            zcToken: {
                address: '0xzcDAI',
                name: 'zcDAI',
                symbol: 'zcDAI',
                decimals: 18,
            },
            cToken: {
                address: '0xzcDAI',
                name: 'zcDAI',
                symbol: 'zcDAI',
                decimals: 18,
            },
        },
        vault: '0xVAULT',
        protocol: {
            name: 'Rari',
            symbol: 'RARI',
            image: 'rari',
        },
        exchangeRate: '0.02',
        supplyRate: '0.0135',
    },
];
