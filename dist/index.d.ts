export declare interface ChangeDetail {
    value: string;
    colorspace: ColorSpace;
    gamut: string;
}

export declare class ColorInput extends HTMLElement {
    #private;
    static get observedAttributes(): string[];
    get value(): string;
    set value(v: string);
    get colorspace(): ColorSpace | string;
    set colorspace(s: ColorSpace | string);
    get theme(): Theme | string;
    set theme(t: Theme | string);
    get noAlpha(): boolean;
    set noAlpha(v: boolean);
    get gamut(): Gamut;
    get contrastColor(): "white" | "black";
    show(anchor?: HTMLElement | null): void;
    close(): void;
    showPicker(): void;
    setAnchor(el: HTMLElement | null): void;
    set setColor(v: string);
    set setAnchorElement(el: HTMLElement | null);
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _old: string | null, value: string | null): void;
}

export declare type ColorSpace = StandardSpace | WideRGB;

declare type Gamut = 'srgb' | 'p3' | 'rec2020' | 'xyz';

declare type StandardSpace = 'srgb' | 'hex' | 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch';

export declare type Theme = 'auto' | 'light' | 'dark';

declare type WideRGB = 'srgb-linear' | 'display-p3' | 'rec2020' | 'a98-rgb' | 'prophoto' | 'xyz' | 'xyz-d50' | 'xyz-d65';

export { }
