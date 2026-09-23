declare module "page-flip/dist/js/page-flip.module.js" {
  export interface PageFlipSettings {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    drawShadow?: boolean;
    maxShadowOpacity?: number;
    flippingTime?: number;
    usePortrait?: boolean;
    mobileScrollSupport?: boolean;
    showPageCorners?: boolean;
    autoSize?: boolean;
    startPage?: number;
  }
  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    on(event: "flip" | "changeState" | "changeOrientation" | "init", cb: (e: { data: unknown }) => void): PageFlip;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): "portrait" | "landscape";
    destroy(): void;
  }
}
