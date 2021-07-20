import { useEffect, useMemo, useState } from 'react';
import { useCanceledEffect } from '../../hooks/useCanceledEffect';
export function useSvgImport(file: File | undefined) {
    const [svgString, setSvgString] = useState<string | undefined>(undefined);

    useCanceledEffect(
        () => {
            if (file && file.type.includes('svg')) {
                return file.text();
            }
            return undefined;
        },
        setSvgString,
        [file]
    );

    return {
        svgString,
    };
}

export type UseSvgImportReturn = ReturnType<typeof useSvgImport>;
