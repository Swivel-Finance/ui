import resolve from '@rollup/plugin-node-resolve';
import html from '@web/rollup-plugin-html';
import { copy } from '@web/rollup-plugin-copy';

const MODULE_NAME = 'main.js';

const BUILD_PATH = './dist/demo/';

const SOURCE_PATH = './demo/';

const OUT_PATH = './out/';

const DIRECTORIES = [
    '',
    'behaviors/',
    'elements/',
];

const PAGES = [
    'behaviors/focus/',
    'behaviors/list/',
    'behaviors/overlay/',
    'behaviors/scroll-table/',
    'elements/collapsible/',
    'elements/dialog/',
    'elements/listbox/',
    'elements/popup/',
    'elements/select/',
    'elements/toggles/',
    'elements/tooltip/',
];

const customWarning = (warning, warn) => {

    // skip certain warnings
    if (warning.code === 'THIS_IS_UNDEFINED') return;

    // Use default for everything else
    warn(warning);
};

export default PAGES.map(PAGE => ({
    input: `${ BUILD_PATH }${ PAGE }${ MODULE_NAME }`,
    output: {
        dir: `${ OUT_PATH }${ PAGE }`,
        format: 'iife',
    },
    plugins: [
        resolve({
            browser: true,
        }),
        html({
            input: `${ SOURCE_PATH }${ PAGE }index.html`,
            extractAssets: false,
        }),
    ],
    onwarn: customWarning,
})).concat(DIRECTORIES.map(DIR => ({
    output: {
        dir: `${ OUT_PATH }${ DIR }`,
    },
    plugins: [
        html({
            input: `${ SOURCE_PATH }${ DIR }index.html`,
            extractAssets: false,
        }),
        ...[DIR === ''
            ? copy({
                patterns: [
                    'assets/svg/*',
                ],
                rootDir: './src',
            })
            : []
        ],
    ],
})));
