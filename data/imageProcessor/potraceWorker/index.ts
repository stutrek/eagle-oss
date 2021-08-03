import { useEffect, useMemo, useRef } from 'react';
import { ModuleThread, spawn, Thread, Worker } from 'threads';
import { PotraceWorker } from './worker';

export const usePotraceWorker = () => {
    let workerPromiseRef = useRef<Promise<ModuleThread<PotraceWorker>>>();

    const worker = useMemo(() => {
        const startWorker = () => {
            if (workerPromiseRef.current) {
                workerPromiseRef.current.then((worker) => {
                    Thread.terminate(worker);
                });
            }
            workerPromiseRef.current = spawn<PotraceWorker>(
                // @ts-ignore
                new Worker(new URL('./worker.ts', import.meta.url))
            );
            return workerPromiseRef.current;
        };

        const workerProxy: PotraceWorker = {
            traceImageBitmap: async (imageBitmap, params, soften) => {
                const worker = await startWorker();
                return worker.traceImageBitmap(imageBitmap, params, soften);
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
