import { useEffect, useState } from 'react';
import { CanvasWithBitmap } from '../../../../components/CanvasWithBitmap';
import { ImageProcessorReturn } from '../../../../data/imageProcessor/useImageProcessor';
import {
    Point,
    UseImageBitmapReturn,
} from '../../../../data/imageProcessor/useBitmapImport';

import { Circle } from './circle';

import styles from './imageStretcher.module.css';
import { Grid } from './grid';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

export const ImageStretcher = ({ imageProcessor }: Props) => {
    const { imageBitmap, stretchOptions, setCorner } =
        imageProcessor.bitmapImport;

    const [stretchState, setStretchState] = useState(stretchOptions);

    useEffect(() => {
        setStretchState(stretchOptions);
    }, [stretchOptions]);

    const setInterimCorner: UseImageBitmapReturn['setCorner'] = (
        side,
        value
    ) => {
        setStretchState({
            ...stretchState,
            [side]: value,
        });
    };

    if (!imageBitmap) {
        return <div />;
    }

    return (
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
                    setCorner={setCorner}
                />
                <Circle
                    side="topRight"
                    stretchState={stretchState}
                    setInterimCorner={setInterimCorner}
                    setCorner={setCorner}
                />
                <Circle
                    side="bottomRight"
                    stretchState={stretchState}
                    setInterimCorner={setInterimCorner}
                    setCorner={setCorner}
                />
                <Circle
                    side="bottomLeft"
                    stretchState={stretchState}
                    setInterimCorner={setInterimCorner}
                    setCorner={setCorner}
                />
            </svg>
        </div>
    );
};
