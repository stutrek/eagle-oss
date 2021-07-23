import { useEffect, useMemo, useState } from 'react';
import { useCanceledEffect } from '../../hooks/useCanceledEffect';
import { usePaperWorker } from './paperWorker';
import type paper from 'paper';
import { usePotraceWorker } from './potraceWorker';
import type Potrace from './potraceWorker/potrace';

const potraceParams: Potrace.Parameters = {
    optcurve: true,
    opttolerance: 0.01,
};

export function useSvgImport(file: File | undefined) {
    const [svgString, setSvgString] = useState<string | undefined>(undefined);
    const [whiteSvgProject, setWhiteSvgProject] = useState<
        paper.Project | undefined
    >(undefined);
    const [whiteSvgString, setWhiteSvgString] = useState<string | undefined>(
        undefined
    );
    const [size, setSize] = useState<[number, number] | undefined>();
    const [paths, setPaths] = useState<string[] | undefined>();

    const paperWorker = usePaperWorker();
    const potraceWorker = usePotraceWorker();

    useCanceledEffect(
        function loadFile() {
            if (file && file.type.includes('svg')) {
                return file.text();
            }
            return undefined;
        },
        setSvgString,
        [file]
    );

    useCanceledEffect(
        function getSvgSize() {
            if (svgString === undefined) {
                return undefined;
            }
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgString, 'image/svg+xml');
            // @ts-ignore documentElement comes through as HTMLElement, which isn't right.
            const width = doc.documentElement.width.baseVal.value as number;
            // @ts-ignore
            const height = doc.documentElement.height.baseVal.value as number;
            return [
                width * window.devicePixelRatio,
                height * window.devicePixelRatio,
            ] as [number, number];
        },
        setSize,
        [svgString]
    );

    useCanceledEffect(
        function getWhiteSvgAndPaperProject() {
            if (svgString === undefined || size === undefined) {
                return undefined;
            }
            return paperWorker.coloredSVGToWhite(svgString, size);
        },
        (project) => {
            setWhiteSvgProject(project);
            setWhiteSvgString(
                project?.exportSVG({
                    bounds: 'content',
                    asString: true,
                }) as string
            );
        },
        [svgString, size]
    );

    useCanceledEffect(
        function runPotrace() {
            if (whiteSvgProject === undefined) {
                return undefined;
            }
            return new Promise<string[]>(async (resolve) => {
                // this has to be in raf because the project
                // hasn't been drawn to the canvas yet, so
                // createImageBitmap would return a white image.
                requestAnimationFrame(async () => {
                    const imageBitmap = await createImageBitmap(
                        whiteSvgProject.view.element
                    );
                    const paths = await potraceWorker.traceImageBitmap(
                        imageBitmap,
                        potraceParams
                    );
                    resolve(paths);
                });
            });
        },
        setPaths,
        [whiteSvgProject]
    );

    return {
        svgString,
        whiteSvgProject,
        whiteSvgString,
        paths,
        size,
    };
}

export type UseSvgImportReturn = ReturnType<typeof useSvgImport>;
