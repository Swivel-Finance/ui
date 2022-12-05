import { LABELS, UNITS } from './constants.js';
import { unixTimestamp } from './timestamp.js';

export interface TimeAgoParts {
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
}

export interface TimeAgoFormats {
    format: string;
    seconds?: string;
    minutes?: string;
    hours?: string;
    days?: string;
}

export class TimeAgoFormatter {

    format (timestamp: Date | number | string): TimeAgoFormats {

        const parts = this.parts(timestamp);

        const days = parts.days > 0 ? this.formatPart(parts.days, 'DAYS') : undefined;
        const hours = parts.hours > 0 ? this.formatPart(parts.hours, 'HOURS') : undefined;
        const minutes = parts.minutes > 0 ? this.formatPart(parts.minutes, 'MINUTES') : undefined;
        const seconds = parts.seconds > 0 ? this.formatPart(parts.seconds, 'SECONDS') : undefined;

        const format = (parts.seconds < 5)
            ? LABELS.NOW
            : days ?? hours ?? minutes ?? seconds as string;

        return {
            format,
            days,
            hours,
            minutes,
            seconds,
        };
    }

    formatPart (value: number, part: keyof typeof UNITS): string {

        return `${ value } ${ value === 1 ? UNITS[part].SINGULAR : UNITS[part].PLURAL } ${ LABELS.AGO }`;
    }

    parts (timestamp: Date | number | string): TimeAgoParts {

        const now = unixTimestamp(Date.now());

        const seconds = now - unixTimestamp(timestamp);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        return {
            seconds,
            minutes,
            hours,
            days,
        };
    }
}
