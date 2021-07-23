import { useEffect, useMemo, useRef } from 'react';
import { ModuleThread, spawn, Thread, Worker } from 'threads';
import { PaperWorkerType } from './worker';

export const usePaperWorker = () => {
    let workerPromiseRef = useRef<Promise<ModuleThread<PaperWorkerType>>>();

    const worker = useMemo(() => {
        const startWorker = () => {
            if (!workerPromiseRef.current) {
                workerPromiseRef.current = spawn<PaperWorkerType>(
                    // @ts-ignore
                    new Worker(new URL('./worker.ts', import.meta.url))
                );
            }
            return workerPromiseRef.current;
        };

        const workerProxy = {
            async coloredSVGToWhite(svg: string, size: [number, number]) {
                const paper = await import('paper');
                const canvas = document.createElement('canvas');
                canvas.width = size[0];
                canvas.height = size[1];
                const project = new paper.Project(canvas);
                project.importSVG(svg);
                const jsonString = project.exportJSON();
                const worker = await startWorker();
                project.clear();
                const whiteJsonString = await worker.coloredSVGToWhite(
                    jsonString,
                    size
                );
                project.importJSON(whiteJsonString);
                return project;
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
