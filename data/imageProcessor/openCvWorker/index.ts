import { ModuleThread, spawn, Transfer, Worker } from 'threads';
import { OpenCvWorkerType } from './worker';

let workerPromise: Promise<ModuleThread<OpenCvWorkerType>>;

const startWorker = () => {
    const workerPromise = spawn<OpenCvWorkerType>(
        // @ts-ignore
        new Worker(new URL('./worker.ts', import.meta.url))
    );
    return workerPromise;
};

const workerProxy: OpenCvWorkerType = {
    adaptiveThreshold: async (imageBitmap) => {
        console.log({ workerPromise });
        const worker = await startWorker();
        return worker.adaptiveThreshold(Transfer(imageBitmap));
    },
};

export const createOpenCvWorker = (): OpenCvWorkerType => {
    return workerProxy;
};
