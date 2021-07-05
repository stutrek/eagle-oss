import { CanvasWithBitmap } from '../../../components/CanvasWithBitmap';
import { ImageProcessorReturn } from '../../../data/imageProcessor/useImageProcessor';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

export const BitmapImport = ({ imageProcessor }: Props) => {
    const { imageBitmap, stretchedBitmap, outlineBitmap } =
        imageProcessor.bitmapImport;

    const secondView = outlineBitmap || stretchedBitmap;
    return (
        <div>
            {imageBitmap && <CanvasWithBitmap imageBitmap={imageBitmap} />}
            {secondView && <CanvasWithBitmap imageBitmap={secondView} />}
        </div>
    );
};
