import { useEffect, useState } from 'react';
import exif from 'exif-js';
import { isEqual } from 'lodash';

import { useOpenCvWorker } from './openCvWorker';

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

    const openCvWorker = useOpenCvWorker();

    useEffect(
        function loadFile() {
            (async () => {
                if (file && file.type.includes('image')) {
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

    useEffect(
        function handleDistortion() {
            if (imageBitmap) {
                let originalStretchOptions = {
                    topLeft: [0, 0],
                    topRight: [imageBitmap.width, 0],
                    bottomRight: [imageBitmap.width, imageBitmap.height],
                    bottomLeft: [0, imageBitmap.height],
                };
                if (isEqual(stretchOptions, originalStretchOptions)) {
                    setStretchedBitmap(imageBitmap);
                } else {
                    openCvWorker
                        .distort(imageBitmap, stretchOptions)
                        .then((outBitmap) => setStretchedBitmap(outBitmap));
                }
            } else {
                setStretchedBitmap(undefined);
            }
        },
        [imageBitmap, stretchOptions]
    );

    useEffect(
        function makeOutline() {
            if (stretchedBitmap) {
                openCvWorker
                    .adaptiveThreshold(stretchedBitmap)
                    .then((outBitmap) => {
                        setOutlineBitmap(outBitmap);
                    });
            } else {
                setOutlineBitmap(undefined);
            }
        },
        [stretchedBitmap]
    );

    return {
        imageBitmap,
        stretchedBitmap,
        outlineBitmap,
        resolution,
        stretchOptions,
        setCorner(side: keyof StretchOptions, value: Point) {
            setStretchOptions({
                ...stretchOptions,
                [side]: value,
            });
        },
    };
};

export type UseImageBitmapReturn = ReturnType<typeof useBitmapImport>;
