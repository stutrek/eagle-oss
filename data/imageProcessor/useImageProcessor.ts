import { SyntheticEvent, useMemo, useState } from 'react';
import { useOpenCvWorker } from './openCvWorker';
import { useBitmapImport } from './useBitmapImport';

interface DragEvent<T = Element> extends SyntheticEvent<T> {
    dataTransfer: DataTransfer;
}

export const useImageProcessor = () => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [svgString, setSvgString] = useState<string | undefined>(undefined);

    const bitmapImport = useBitmapImport(file);

    const processFile = useMemo(
        () => async (file: File) => {
            setFile(file);
            if (file.type.includes('svg')) {
                const text = await file.text();
                setSvgString(text);
            } else if (file.type.includes('image') === false) {
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
        },
        bitmapImport,
        result: {
            pieces: undefined,
        },
    };
};

export type ImageProcessorReturn = ReturnType<typeof useImageProcessor>;
