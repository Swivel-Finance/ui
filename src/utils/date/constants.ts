export const DAYS_PER_YEAR = 365;

export const SECONDS_PER_MINUTE = 60;

export const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;

export const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;

export const SECONDS_PER_WEEK = SECONDS_PER_DAY * 7;

export const SECONDS_PER_MONTH = SECONDS_PER_DAY * 30;

export const SECONDS_PER_YEAR = SECONDS_PER_DAY * DAYS_PER_YEAR;

export const UNITS = {
    SECONDS: {
        SINGULAR: 'second',
        PLURAL: 'seconds',
    },
    MINUTES: {
        SINGULAR: 'minute',
        PLURAL: 'minutes',
    },
    HOURS: {
        SINGULAR: 'hour',
        PLURAL: 'hours',
    },
    DAYS: {
        SINGULAR: 'day',
        PLURAL: 'days',
    },
} as const;

export const LABELS = {
    ...UNITS,
    AGO: 'ago',
    NOW: 'just now',
} as const;
