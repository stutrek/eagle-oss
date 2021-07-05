import { useEffect, useMemo, useRef } from 'react';
import { ModuleThread, spawn, Thread, Transfer, Worker } from 'threads';
import { OpenCvWorkerType } from './worker';

export const useOpenCvWorker = () => {
    let workerPromiseRef = useRef<Promise<ModuleThread<OpenCvWorkerType>>>();

    const worker = useMemo(() => {
        const startWorker = () => {
            workerPromiseRef.current = spawn<OpenCvWorkerType>(
                // @ts-ignore
                new Worker(new URL('./worker.ts', import.meta.url))
            );
            return workerPromiseRef.current;
        };

        const workerProxy: OpenCvWorkerType = {
            adaptiveThreshold: async (imageBitmap) => {
                const worker = await startWorker();
                return worker.adaptiveThreshold(imageBitmap);
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
