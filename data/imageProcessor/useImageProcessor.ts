import { SyntheticEvent, useMemo, useState } from 'react';
import exif from 'exif-js';
import { createOpenCvWorker } from './openCvWorker';

interface DragEvent<T = Element> extends SyntheticEvent<T> {
    dataTransfer: DataTransfer;
}

export const useImageProcessor = () => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [svgString, setSvgString] = useState<string | undefined>(undefined);
    const [imageBitmap, setImageBitmap] = useState<ImageBitmap | undefined>(
        undefined
    );
    const [resolution, setResolution] = useState<number | undefined>();

    const openCvWorker = createOpenCvWorker();

    const processFile = useMemo(
        () => async (file: File) => {
            setFile(file);
            if (file.type.includes('svg')) {
                const text = await file.text();
                setResolution(72);
                setSvgString(text);
            } else if (file.type.includes('image')) {
                const buffer = await file.arrayBuffer();
                const result = exif.readFromBinaryFile(buffer);
                setResolution(result.XResolution || 72);
                const imageBitmap = await createImageBitmap(file);
                const imageBitmap2 = await createImageBitmap(file);

                openCvWorker
                    .adaptiveThreshold(imageBitmap2)
                    .then((outBitmap) => {
                        setImageBitmap(outBitmap);
                    });

                setImageBitmap(imageBitmap);
            } else {
                alert(
                    `This file couldn't be read because it's not an image file.`
                );
            }
        },
        []
    );

    const listeners = useMemo(
        () => ({
            onDrop: (event: DragEvent<HTMLInputElement>) => {
                const { files } = event.currentTarget;
                if (files && files[0]) {
                    processFile(files[0]);
                }
            },
            onDragOver: (event: DragEvent<HTMLInputElement>) => {
                event.preventDefault();
                if ('dataTransfer' in event) {
                    event.dataTransfer.dropEffect = 'copy';
                }
            },
            onChange: (event: SyntheticEvent<HTMLInputElement>) => {
                const { files } = event.currentTarget;
                if (files && files[0]) {
                    processFile(files[0]);
                }
            },
        }),
        []
    );

    return {
        listeners,
        upload: {
            file,
            svgString,
            imageBitmap,
            resolution,
        },
        result: {
            pieces: undefined,
        },
    };
};

export type ImageProcessorReturn = ReturnType<typeof useImageProcessor>;
