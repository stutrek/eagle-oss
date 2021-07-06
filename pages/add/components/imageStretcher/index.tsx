import { CanvasWithBitmap } from '../../../../components/CanvasWithBitmap';
import { ImageProcessorReturn } from '../../../../data/imageProcessor/useImageProcessor';

import { Circle } from './circle';

import styles from './imageStretcher.module.css';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

export const ImageStretcher = ({ imageProcessor }: Props) => {
    const { imageBitmap, stretchOptions, setCorner } =
        imageProcessor.bitmapImport;

    if (!imageBitmap) {
        return <div />;
    }

    return (
        <div className={styles.container}>
            <CanvasWithBitmap imageBitmap={imageBitmap} />
            <svg width={imageBitmap.width} height={imageBitmap.height}>
                <polyline
                    points={[
                        stretchOptions.topLeft,
                        stretchOptions.topRight,
                        stretchOptions.bottomRight,
                        stretchOptions.bottomLeft,
                    ].join(' ')}
                    fill="#f99"
                    fillOpacity="0.4"
                    stroke="#f99"
                />
                <Circle
                    side="topLeft"
                    stretchOptions={stretchOptions}
                    setCorner={setCorner}
                />
                <Circle
                    side="topRight"
                    stretchOptions={stretchOptions}
                    setCorner={setCorner}
                />
                <Circle
                    side="bottomRight"
                    stretchOptions={stretchOptions}
                    setCorner={setCorner}
                />
                <Circle
                    side="bottomLeft"
                    stretchOptions={stretchOptions}
                    setCorner={setCorner}
                />
            </svg>
        </div>
    );
};
