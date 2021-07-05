import { useEffect, useState } from 'react';
import exif from 'exif-js';

import { useOpenCvWorker } from './openCvWorker';

type Point = [number, number];
export type StretchOptions = {
    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;
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

    const openCvWorker = useOpenCvWorker();

    useEffect(
        function loadFile() {
            (async () => {
                if (file && file.type.includes('image')) {
                    const buffer = await file.arrayBuffer();
                    const result = exif.readFromBinaryFile(buffer);
                    setResolution(result.XResolution || 72);
                    const imageBitmap = await createImageBitmap(file);
                    setImageBitmap(imageBitmap);

                    const imageBitmap2 = await createImageBitmap(file);
                    setStretchedBitmap(imageBitmap2);
                } else {
                    setImageBitmap(undefined);
                    setStretchedBitmap(undefined);
                }
            })();
        },
        [file]
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
    };
};
