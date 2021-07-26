import { SyntheticEvent, useMemo, useState } from 'react';
import { useBitmapImport } from './useBitmapImport';
import { useSvgImport } from './useSvgImport';

interface DragEvent<T = Element> extends SyntheticEvent<T> {
    dataTransfer: DataTransfer;
}

export const useImageProcessor = () => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const bitmapImport = useBitmapImport(file);
    const svgImport = useSvgImport(file);

    const processFile = useMemo(
        () => async (file: File) => {
            if (file.type.includes('image') === false) {
                setErrorMessage(
                    `This file couldn't be read because it's not an image file.`
                );
            } else {
                setErrorMessage(undefined);
                setFile(file);
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
            errorMessage,
        },
        bitmapImport,
        svgImport,
        result: {
            pieces: undefined,
        },
    };
};

export type ImageProcessorReturn = ReturnType<typeof useImageProcessor>;
