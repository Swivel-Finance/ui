const FIRST = /^[^]/;
const SPACES = /\s+([\S])/g;
const CAMELS = /[a-z]([A-Z])/g;
const KEBABS = /-([a-z])/g;

export function capitalize (string: string): string {

    return string ? string.replace(FIRST, string[0].toUpperCase()) : string;
}

export function uncapitalize (string: string): string {

    return string ? string.replace(FIRST, string[0].toLowerCase()) : string;
}

export function camelCase (string: string): string {

    let matches;

    if (string) {

        string = string.trim();

        while ((matches = SPACES.exec(string))) {
            string = string.replace(matches[0], matches[1].toUpperCase());
            SPACES.lastIndex = 0;
        }

        while ((matches = KEBABS.exec(string))) {
            string = string.replace(matches[0], matches[1].toUpperCase());
            KEBABS.lastIndex = 0;
        }
    }

    return uncapitalize(string);
}

export function kebabCase (string: string): string {

    let matches;

    if (string) {

        string = string.trim();

        while ((matches = SPACES.exec(string))) {
            string = string.replace(matches[0], '-' + matches[1]);
            SPACES.lastIndex = 0;
        }

        while ((matches = CAMELS.exec(string))) {
            string = string.replace(matches[0], matches[0][0] + '-' + matches[1]);
            CAMELS.lastIndex = 0;
        }
    }

    return string ? string.toLowerCase() : string;
}

/**
 * Converts a string to a safe kebab-cased version.
 *
 * @remarks
 * Creates a safe kebab-cased version of a string suitable for use as attribute or event name.
 * It replaces non-word characters with dashes and reduces multiple consequitive dashes into
 * one and removes trailing dashes.
 *
 * @param value - the string to convert
 *
 * @public
 */
export function safeKebabCase (value: string): string {

    return kebabCase(value).replace(/\W+/g, '-').replace(/^-|-$/g, '');
}
