import cv, { Mat } from '@techstark/opencv-js';
import { expose, Transfer } from 'threads/worker';
import type { TransferDescriptor } from 'threads';
import { StretchOptions } from '../useBitmapImport';

// @ts-ignore openCV checks if `xyz instanceof HTMLCanvasElement`,
// but for workers, OffscreenCanvas will do the trick.
self.HTMLCanvasElement = OffscreenCanvas;

const cvReadyPromise = new Promise<void>((resolve) => {
    cv.onRuntimeInitialized = () => resolve();
});

const matFromImageBitmap = (imageBitmap: ImageBitmap) => {
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('no 2d');
    }
    context.drawImage(imageBitmap, 0, 0);
    const mat = cv.matFromImageData(
        context.getImageData(0, 0, imageBitmap.width, imageBitmap.height)
    );

    return [mat, canvas] as const;
};

async function adaptiveThreshold(
    imageBitmap: ImageBitmap
): Promise<TransferDescriptor<ImageBitmap>> {
    await cvReadyPromise;
    const [src, canvas] = matFromImageBitmap(imageBitmap);

    const thesholdDestination = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    // You can try more different parameters
    cv.adaptiveThreshold(
        src,
        thesholdDestination,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        21,
        8
    );

    let ksize = new cv.Size(1, 1);
    const blurDestination = new cv.Mat();
    cv.GaussianBlur(
        thesholdDestination,
        blurDestination,
        ksize,
        0,
        0,
        cv.BORDER_DEFAULT
    );

    // @ts-ignore
    cv.imshow(canvas, blurDestination);

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('no 2d');
    }
    context.strokeStyle = '1px solid black';
    context?.strokeRect(0, 0, canvas.width, canvas.height);
    src.delete();
    thesholdDestination.delete();
    blurDestination.delete();
    const outBitmap = await createImageBitmap(canvas);

    return Transfer(outBitmap);
}

function average(...args: number[]) {
    return args.reduce((a, b) => a + b, 0) / args.length;
}

async function distort(
    imageBitmap: ImageBitmap,
    stretchOptions: StretchOptions
): Promise<TransferDescriptor<ImageBitmap>> {
    await cvReadyPromise;
    const [src, canvas] = matFromImageBitmap(imageBitmap);
    const { topRight, topLeft, bottomRight, bottomLeft } = stretchOptions;

    const newWidth = Math.floor(
        average(topRight[0] - topLeft[0], bottomRight[0] - bottomLeft[0])
    );
    const newHeight = Math.floor(
        average(bottomLeft[1] - topLeft[1], bottomRight[1] - topRight[1])
    );

    let dst = new cv.Mat();
    let dsize = new cv.Size(newWidth, newHeight);

    // (data32F[0], data32F[1]) is the first point
    // (data32F[2], data32F[3]) is the sescond point
    // (data32F[4], data32F[5]) is the third point
    // (data32F[6], data32F[7]) is the fourth point
    let srcTri = cv.matFromArray(
        4,
        1,
        cv.CV_32FC2,
        [...topLeft, ...topRight, ...bottomLeft, ...bottomRight]
        //[56, 65, 368, 52, 28, 387, 389, 390]
    );
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0,
        0,
        newWidth,
        0,
        0,
        newHeight,
        newWidth,
        newHeight,
    ]);
    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    // You can try more different parameters
    cv.warpPerspective(
        src,
        dst,
        M,
        dsize,
        cv.INTER_LINEAR,
        cv.BORDER_CONSTANT,
        new cv.Scalar()
    );

    const outCanvas = new OffscreenCanvas(newWidth, newHeight);
    //@ts-ignore
    cv.imshow(outCanvas, dst);
    src.delete();
    dst.delete();
    M.delete();
    srcTri.delete();
    dstTri.delete();

    const outBitmap = await createImageBitmap(outCanvas);

    return Transfer(outBitmap);
}

type UnboxTransferDescriptorAndPromise<T> = T extends (
    ...a: any
) => Promise<TransferDescriptor<infer U>>
    ? (...a: Parameters<T>) => Promise<U>
    : T;

type RemoveTransferDescriptors<T> = {
    [K in keyof T]: UnboxTransferDescriptorAndPromise<T[K]>;
};

const toExpose = {
    adaptiveThreshold,
    distort,
} as const;

expose(toExpose);

export type OpenCvWorkerType = RemoveTransferDescriptors<typeof toExpose>;
