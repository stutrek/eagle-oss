import { useEffect, useState } from 'react';
import exif from 'exif-js';
import { isEqual } from 'lodash';

import { useOpenCvWorker } from './openCvWorker';
import { usePotraceWorker } from './potraceWorker';
import type Potrace from './potraceWorker/potrace';
import { useCanceledEffect } from '../../hooks/useCanceledEffect';

export type Point = [number, number];
export type StretchOptions = {
    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;
};

const initialStretchOptions: StretchOptions = {
    topLeft: [0, 0],
    topRight: [0, 0],
    bottomLeft: [0, 0],
    bottomRight: [0, 0],
};

const potraceParams: Potrace.Parameters = {
    optcurve: true,
    opttolerance: 0.01,
};

export const useBitmapImport = (file: File | undefined) => {
    const [imageBitmap, setImageBitmap] = useState<ImageBitmap | undefined>(
        undefined
    );

    const [stretchedBitmap, setStretchedBitmap] = useState<
        ImageBitmap | undefined
    >(undefined);

    const [outlineBitmap, setOutlineBitmap] = useState<ImageBitmap | undefined>(
        undefined
    );

    const [resolution, setResolution] = useState<number | undefined>();

    const [stretchOptions, setStretchOptions] = useState<StretchOptions>(
        initialStretchOptions
    );

    const [paths, setPaths] = useState<string[] | undefined>();

    const openCvWorker = useOpenCvWorker();
    const potraceWorker = usePotraceWorker();

    useEffect(
        function loadFile() {
            (async () => {
                if (
                    file &&
                    file.type.includes('image') &&
                    file.type.includes('svg') === false
                ) {
                    const buffer = await file.arrayBuffer();
                    const result = exif.readFromBinaryFile(buffer);
                    setResolution(result.XResolution || 72);
                    const imageBitmap = await createImageBitmap(file);
                    setStretchOptions({
                        topLeft: [0, 0],
                        topRight: [imageBitmap.width, 0],
                        bottomRight: [imageBitmap.width, imageBitmap.height],
                        bottomLeft: [0, imageBitmap.height],
                    });
                    setImageBitmap(imageBitmap);

                    const imageBitmap2 = await createImageBitmap(file);
                    setStretchedBitmap(imageBitmap2);
                } else {
                    setImageBitmap(undefined);
                    setStretchedBitmap(undefined);
                    setStretchOptions(initialStretchOptions);
                }
            })();
        },
        [file]
    );

    useCanceledEffect(
        function handleDistortion() {
            if (imageBitmap) {
                let originalStretchOptions = {
                    topLeft: [0, 0],
                    topRight: [imageBitmap.width, 0],
                    bottomRight: [imageBitmap.width, imageBitmap.height],
                    bottomLeft: [0, imageBitmap.height],
                };
                if (isEqual(stretchOptions, originalStretchOptions)) {
                    return imageBitmap;
                } else {
                    setStretchedBitmap(undefined);
                    return openCvWorker.distort(imageBitmap, stretchOptions);
                }
            } else {
                return undefined;
            }
        },
        setStretchedBitmap,
        [imageBitmap, stretchOptions]
    );

    useCanceledEffect(
        function makeOutline() {
            if (stretchedBitmap) {
                return openCvWorker.adaptiveThreshold(stretchedBitmap);
            } else {
                return undefined;
            }
        },
        setOutlineBitmap,
        [stretchedBitmap]
    );

    useCanceledEffect(
        function potrace() {
            if (outlineBitmap) {
                return potraceWorker.traceImageBitmap(
                    outlineBitmap,
                    potraceParams
                );
            } else {
                return undefined;
            }
        },
        setPaths,
        [outlineBitmap]
    );

    return {
        imageBitmap,
        stretchedBitmap,
        outlineBitmap,
        resolution,
        stretchOptions,
        paths,
        setCorner(side: keyof StretchOptions, value: Point) {
            setStretchOptions({
                ...stretchOptions,
                [side]: value,
            });
        },
    };
};

export type UseImageBitmapReturn = ReturnType<typeof useBitmapImport>;
