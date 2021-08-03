declare namespace Potrace {
    type Parameters = Partial<{
        turnpolicy:
            | 'black'
            | 'white'
            | 'left'
            | 'right'
            | 'minority'
            | 'majority';
        turdsize: number;
        optcurve: boolean;
        alphamax: number;
        opttolerance: number;
    }>;
    interface Point {
        x: number;
        y: number;
    }
    interface Path {
        area: number;
        len: number;
        curve: Curve;
        pt: Point;
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    }
    interface Curve {
        n: Point;
        tag: Point[];
        c: Point[];
        alphaCurve: number;
        vertex: Point[];
        alpha: Point[];
        alpha0: Point[];
        beta: Point[];
    }
    function loadImageBitmap(imageBitmap: ImageBitmap): void;
    function setParameter(params: Partial<Parameters>): void;
    function process(callback: Function): void;
    function getSVG(size: number, opt_type: 'curve' | undefined): void;
    function setCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): void;
    function getContext(): CanvasRenderingContext2D;
    function getSVGPaths(size: number): string[];
    function getPathlist(): Path[];
    function pathToString(curve: Curve, size: number): string;
    function clear(): void;
}

export default Potrace;
