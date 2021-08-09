import { useCallback, useEffect, useState } from 'react';
import { CanvasWithBitmap } from '../../CanvasWithBitmap';
import { ImageProcessorReturn } from '../../../data/imageProcessor/useImageProcessor';
import {
    Point,
    UseImageBitmapReturn,
} from '../../../data/imageProcessor/useBitmapImport';

import { Circle } from './circle';

import styles from './imageStretcher.module.css';
import { Grid } from './grid';
import { useViewport } from '../../../components/viewport';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

function applyScaledDrag(current: Point, next: Point, zoom: number): Point {
    const diff = [
        (next[0] - current[0]) * (1 / zoom),
        (next[1] - current[1]) * (1 / zoom),
    ];
    return [current[0] + diff[0], current[1] + diff[1]];
}

export const ImageStretcher = ({ imageProcessor }: Props) => {
    const { imageBitmap, stretchOptions, setCorner } =
        imageProcessor.bitmapImport;

    const [stretchState, setStretchState] = useState(stretchOptions);

    const viewport = useViewport(false);

    useEffect(() => {
        setStretchState(stretchOptions);
    }, [stretchOptions]);

    const finalizeCorner = useCallback<UseImageBitmapReturn['setCorner']>(
        (side, value) => {
            setCorner(
                side,
                applyScaledDrag(stretchState[side], value, viewport.zoom)
            );
        },
        [stretchState, viewport.zoom, setCorner]
    );

    const setInterimCorner = useCallback<UseImageBitmapReturn['setCorner']>(
        (side, value) => {
            setStretchState({
                ...stretchState,
                [side]: applyScaledDrag(
                    stretchState[side],
                    value,
                    viewport.zoom
                ),
            });
        },
        [stretchState, viewport.zoom]
    );

    if (!imageBitmap) {
        return <div />;
    }

    return (
        <div {...viewport.outerProps}>
            <div {...viewport.innerProps}>
                <div className={styles.container}>
                    <CanvasWithBitmap imageBitmap={imageBitmap} />
                    <svg width={imageBitmap.width} height={imageBitmap.height}>
                        <polyline
                            points={[
                                stretchState.topLeft,
                                stretchState.topRight,
                                stretchState.bottomRight,
                                stretchState.bottomLeft,
                            ].join(' ')}
                            fill="#f99"
                            fillOpacity="0.4"
                            stroke="#f99"
                        />
                        <Grid points={stretchState} divisions={10} />
                        <Circle
                            side="topLeft"
                            stretchState={stretchState}
                            setInterimCorner={setInterimCorner}
                            setCorner={finalizeCorner}
                            zoom={viewport.zoom}
                        />
                        <Circle
                            side="topRight"
                            stretchState={stretchState}
                            setInterimCorner={setInterimCorner}
                            setCorner={finalizeCorner}
                            zoom={viewport.zoom}
                        />
                        <Circle
                            side="bottomRight"
                            stretchState={stretchState}
                            setInterimCorner={setInterimCorner}
                            setCorner={finalizeCorner}
                            zoom={viewport.zoom}
                        />
                        <Circle
                            side="bottomLeft"
                            stretchState={stretchState}
                            setInterimCorner={setInterimCorner}
                            setCorner={finalizeCorner}
                            zoom={viewport.zoom}
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};
