import { LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const SYMBOLS = {
    rari: svg`
    <svg viewBox="0 0 256 256" fill="none">
        <circle cx="128" cy="128" r="128" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M128 256C198.692 256 256 198.692 256 128C256 57.3076 198.692 5.72205e-06 128 5.72205e-06C57.3076 5.72205e-06 3.05176e-05 57.3076 3.05176e-05 128C3.05176e-05 198.692 57.3076 256 128 256ZM128 246C193.17 246 246 193.17 246 128C246 62.8304 193.17 10 128 10C62.8304 10 10 62.8304 10 128C10 193.17 62.8304 246 128 246Z" fill="url(#paint0_linear_2_21)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M78.25 215.536C126.318 243.288 187.783 226.818 215.536 178.75C243.288 130.682 226.818 69.2168 178.75 41.4644C130.682 13.7121 69.2168 30.1816 41.4644 78.25C13.7121 126.318 30.1816 187.783 78.25 215.536ZM83.25 206.875C126.535 231.866 181.884 217.035 206.875 173.75C231.866 130.465 217.035 75.1156 173.75 50.1247C130.465 25.1338 75.1156 39.9645 50.1247 83.25C25.1338 126.535 39.9645 181.884 83.25 206.875Z" fill="url(#paint1_linear_2_21)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M128.5 206C171.302 206 206 171.302 206 128.5C206 85.6979 171.302 51 128.5 51C85.6979 51 51 85.6979 51 128.5C51 171.302 85.6979 206 128.5 206ZM128.5 196C165.779 196 196 165.779 196 128.5C196 91.2208 165.779 61 128.5 61C91.2208 61 61 91.2208 61 128.5C61 165.779 91.2208 196 128.5 196Z" fill="url(#paint2_linear_2_21)"/>
        <defs>
            <linearGradient id="paint0_linear_2_21" x1="256" y1="128" x2="3.05176e-05" y2="128" gradientUnits="userSpaceOnUse">
            <stop/>
            <stop offset="1" stop-color="white"/>
            </linearGradient>
            <linearGradient id="paint1_linear_2_21" x1="41.2144" y1="78.683" x2="215.286" y2="179.183" gradientUnits="userSpaceOnUse">
            <stop/>
            <stop offset="1" stop-color="white"/>
            </linearGradient>
            <linearGradient id="paint2_linear_2_21" x1="206" y1="129" x2="51" y2="129" gradientUnits="userSpaceOnUse">
            <stop/>
            <stop offset="1" stop-color="white"/>
            </linearGradient>
        </defs>
    </svg>
    `,
    compound: svg`
    <svg viewBox="0 0 16 16" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.66652 12.4698C1.25295 12.2261 1 11.7921 1 11.326V8.72374C1 8.62412 1.02769 8.52812 1.07939 8.44273C1.24002 8.17588 1.59636 8.08522 1.87331 8.24172L7.96991 11.6658C8.32624 11.8668 8.54596 12.2332 8.54596 12.6316V15.3282C8.54596 15.451 8.51084 15.5737 8.44441 15.6786C8.24314 15.9953 7.81478 16.0949 7.48613 15.901L1.66652 12.4698ZM10.7541 7.52842C11.1105 7.72942 11.3302 8.09588 11.3302 8.49428V13.9657C11.3302 14.1276 11.2397 14.277 11.0939 14.3553L9.75895 15.0792C9.74235 15.0881 9.72389 15.0952 9.70544 15.1006V12.0625C9.70544 11.6693 9.49126 11.3047 9.14046 11.1019L3.78611 8.01582V4.5864C3.78611 4.48679 3.81381 4.39074 3.8655 4.30536C4.02613 4.03854 4.38247 3.94783 4.65942 4.10436L10.7541 7.52842ZM13.4221 3.48714C13.7803 3.68635 14 4.05633 14 4.45477V12.4467C14 12.6103 13.9058 12.7615 13.7563 12.8398L12.4915 13.4979V7.93399C12.4915 7.54092 12.2774 7.17802 11.9284 6.97523L6.4559 3.81265V0.559321C6.4559 0.459711 6.48359 0.363659 6.53344 0.278279C6.69407 0.0114676 7.05041 -0.0792482 7.32737 0.0755027L13.4221 3.48714Z" fill="#00D395"/>
    </svg>
    `,
    dai: svg`
    <svg viewBox="0 0 16 16" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00006 0L0 8.00006L8.00004 16.0002L16 8.00015L8.00006 0ZM13.1716 8.00015L8.00006 2.82843L2.82843 8.00006L5.33346 8.00015L8.00006 5.3334L10.6667 8.00008L13.1716 8.00015Z" fill="#FDC134"/>
    </svg>
    `,
    dai_alt: svg`
    <svg viewBox="0 0 177 177" fill="none">
        <circle cx="88.5" cy="88.5" r="88.5" fill="#FDC134"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M54.9359 46.8229H88.6483C109.154 46.8229 124.698 57.8448 130.481 73.8831H140.983V83.577H132.693C132.855 85.1087 132.938 86.6693 132.938 88.2549V88.4931C132.938 90.2782 132.833 92.033 132.628 93.7517H140.983V103.446H130.281C124.346 119.261 108.923 130.178 88.6483 130.178H54.9359V103.446H43.2212V93.7517H54.9359V83.577H43.2212V73.8831H54.9359V46.8229ZM64.3606 103.446V121.482H88.6483C103.636 121.482 114.771 114.258 119.955 103.446H64.3606ZM122.842 93.7517H64.3606V83.577H122.857C123.074 85.1781 123.185 86.8194 123.185 88.4931V88.7312C123.185 90.4433 123.069 92.1195 122.842 93.7517ZM88.6483 55.5046C103.705 55.5046 114.874 62.9188 120.026 73.8831H64.3606V55.5046H88.6483Z" fill="white"/>
    </svg>
    `,
    usdc: svg`
    <svg viewBox="0 0 16 16" fill="none">
        <path d="M6.04446 15.6049C6.04446 15.8831 5.86668 15.9759 5.60002 15.9759C2.31112 14.863 0 11.7097 0 8.00001C0 4.29029 2.31112 1.13704 5.60002 0.0241251C5.86668 -0.0686177 6.04446 0.116868 6.04446 0.395096V1.0443C6.04446 1.22978 5.95557 1.41527 5.77779 1.50801C3.20001 2.52818 1.42223 5.03224 1.42223 8.00001C1.42223 10.9678 3.2889 13.5646 5.77779 14.492C5.95557 14.5847 6.04446 14.7702 6.04446 14.9557V15.6049Z" fill="#2775CA"/>
        <path d="M8.71115 13.2863C8.71115 13.4718 8.53337 13.6573 8.35559 13.6573H7.64448C7.4667 13.6573 7.28892 13.4718 7.28892 13.2863V12.1734C5.8667 11.9879 5.15558 11.1532 4.88892 9.94759C4.88892 9.76211 4.97781 9.57662 5.15558 9.57662H5.95559C6.13336 9.57662 6.22225 9.66936 6.31114 9.85485C6.48892 10.504 6.84448 11.0605 8.00004 11.0605C8.88893 11.0605 9.51115 10.5968 9.51115 9.85485C9.51115 9.11291 9.15559 8.83468 7.91115 8.64919C6.04447 8.37096 5.15558 7.81451 5.15558 6.23788C5.15558 5.03222 6.04447 4.1048 7.28892 3.91931V2.8064C7.28892 2.62091 7.4667 2.43542 7.64448 2.43542H8.35559C8.53337 2.43542 8.71115 2.62091 8.71115 2.8064V3.91931C9.77782 4.1048 10.4889 4.75399 10.6667 5.77417C10.6667 5.95965 10.5778 6.14514 10.4 6.14514H9.68893C9.51115 6.14514 9.42226 6.05239 9.33337 5.86691C9.15559 5.21771 8.71115 4.93948 7.91115 4.93948C7.02226 4.93948 6.57781 5.40319 6.57781 6.05239C6.57781 6.70159 6.84448 7.07257 8.17781 7.25805C10.0445 7.53628 10.9334 8.09274 10.9334 9.66936C10.9334 10.875 10.0445 11.8952 8.71115 12.1734V13.2863V13.2863Z" fill="#2775CA"/>
        <path d="M10.4 15.9759C10.1333 16.0686 9.95557 15.8831 9.95557 15.6049V14.9557C9.95557 14.7702 10.0445 14.5847 10.2222 14.492C12.8 13.4718 14.5778 10.9678 14.5778 7.99999C14.5778 5.03222 12.7111 2.43542 10.2222 1.50799C10.0445 1.41525 9.95557 1.22977 9.95557 1.04428V0.39508C9.95557 0.116852 10.1333 0.0241089 10.4 0.0241089C13.6 1.13702 16 4.29028 16 7.99999C16 11.7097 13.6889 14.863 10.4 15.9759Z" fill="#2775CA"/>
    </svg>
    `,
    usdc_alt: svg`
    <svg viewBox="0 0 256 256" fill="none">
        <style type="text/css">
            .st0{fill:#2775CA;}
            .st1{fill:#FFFFFF;}
        </style>
        <circle class="st0" cx="128" cy="128" r="128"/>
        <path class="st1" d="M104,217c0,3-2.4,4.7-5.2,3.8C60,208.4,32,172.2,32,129.3c0-42.8,28-79.1,66.8-91.5c2.9-0.9,5.2,0.8,5.2,3.8
            v7.5c0,2-1.5,4.3-3.4,5C69.9,65.4,48,94.9,48,129.3c0,34.5,21.9,63.9,52.6,75.1c1.9,0.7,3.4,3,3.4,5V217z"/>
        <path class="st1" d="M136,189.3c0,2.2-1.8,4-4,4h-8c-2.2,0-4-1.8-4-4v-12.6c-17.5-2.4-26-12.1-28.3-25.5c-0.4-2.3,1.4-4.3,3.7-4.3
            h9.1c1.9,0,3.5,1.4,3.9,3.2c1.7,7.9,6.3,14,20.3,14c10.3,0,17.7-5.8,17.7-14.4c0-8.6-4.3-11.9-19.5-14.4c-22.4-3-33-9.8-33-27.3
            c0-13.5,10.3-24.1,26.1-26.3V69.3c0-2.2,1.8-4,4-4h8c2.2,0,4,1.8,4,4v12.7c12.9,2.3,21.1,9.6,23.8,21.8c0.5,2.3-1.3,4.4-3.7,4.4
            h-8.4c-1.8,0-3.3-1.2-3.8-2.9c-2.3-7.7-7.8-11.1-17.4-11.1c-10.6,0-16.1,5.1-16.1,12.3c0,7.6,3.1,11.4,19.4,13.7
            c22,3,33.4,9.3,33.4,28c0,14.2-10.6,25.7-27.1,28.3V189.3z"/>
        <path class="st1" d="M157.2,220.8c-2.9,0.9-5.2-0.8-5.2-3.8v-7.5c0-2.2,1.3-4.3,3.4-5c30.6-11.2,52.6-40.7,52.6-75.1
            c0-34.5-21.9-63.9-52.6-75.1c-1.9-0.7-3.4-3-3.4-5v-7.5c0-3,2.4-4.7,5.2-3.8C196,50.2,224,86.5,224,129.3
            C224,172.2,196,208.4,157.2,220.8z"/>
    </svg>
    `,
};

const template = function (this: SymbolElement) {

    return this.name && SYMBOLS[this.name] || nothing;
};

@customElement('sw-symbol')
export class SymbolElement extends LitElement {

    @property({ attribute: true })
    name?: keyof typeof SYMBOLS;

    protected createRenderRoot (): Element | ShadowRoot {

        return this;
    }

    protected render (): unknown {

        return template.apply(this);
    }
}