import cv from '@techstark/opencv-js';
import { expose, Transfer } from 'threads/worker';
import type { TransferDescriptor } from 'threads';

// @ts-ignore openCV checks if `xyz instanceof HTMLCanvasElement`,
// but for workers, OffscreenCanvas will do the trick.
self.HTMLCanvasElement = OffscreenCanvas;

const cvReadyPromise = new Promise<void>((resolve) => {
    cv.onRuntimeInitialized = () => resolve();
});

async function adaptiveThreshold(
    imageBitmap: ImageBitmap
): Promise<TransferDescriptor<ImageBitmap>> {
    await cvReadyPromise;
    const outCanvas = new OffscreenCanvas(
        imageBitmap.width,
        imageBitmap.height
    );
    const context = outCanvas.getContext('2d');
    if (!context) {
        throw new Error('no 2d');
    }
    context.drawImage(imageBitmap, 0, 0);
    let src = cv.matFromImageData(
        context.getImageData(0, 0, imageBitmap.width, imageBitmap.height)
    );

    let dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    // You can try more different parameters
    cv.adaptiveThreshold(
        src,
        dst,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        21,
        8
    );
    // @ts-ignore
    cv.imshow(outCanvas, dst);
    src.delete();
    dst.delete();
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
} as const;

expose(toExpose);

export type OpenCvWorkerType = RemoveTransferDescriptors<typeof toExpose>;
