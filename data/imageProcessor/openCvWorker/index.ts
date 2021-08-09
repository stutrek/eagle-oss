import { useEffect, useMemo, useRef } from 'react';
import { ModuleThread, spawn, Thread, Worker } from 'threads';
import { OpenCvWorkerType } from './worker';

export const useOpenCvWorker = () => {
    const workerPromiseRef = useRef<Promise<ModuleThread<OpenCvWorkerType>>>();

    const worker = useMemo(() => {
        const startWorker = () => {
            if (!workerPromiseRef.current) {
                workerPromiseRef.current = spawn<OpenCvWorkerType>(
                    // @ts-ignore
                    new Worker(new URL('./worker.ts', import.meta.url))
                );
            }
            return workerPromiseRef.current;
        };

        const workerProxy: OpenCvWorkerType = {
            adaptiveThreshold: async (imageBitmap) => {
                const worker = await startWorker();
                return worker.adaptiveThreshold(imageBitmap);
            },
            distort: async (imageBitmap, newCorners) => {
                const worker = await startWorker();
                return worker.distort(imageBitmap, newCorners);
            },
        };
        return workerProxy;
    }, []);

    useEffect(() => {
        if (workerPromiseRef.current) {
            workerPromiseRef.current.then((worker) => {
                Thread.terminate(worker);
            });
        }
    }, []);

    return worker;
};
