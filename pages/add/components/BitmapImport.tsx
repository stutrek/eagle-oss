import { CanvasWithBitmap } from '../../../components/CanvasWithBitmap';
import { ImageProcessorReturn } from '../../../data/imageProcessor/useImageProcessor';
import { ImageStretcher } from './imageStretcher';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

export const BitmapImport = ({ imageProcessor }: Props) => {
    const { imageBitmap, stretchedBitmap, outlineBitmap } =
        imageProcessor.bitmapImport;

    const secondView = outlineBitmap || stretchedBitmap;
    return (
        <div>
            {imageBitmap && <ImageStretcher imageProcessor={imageProcessor} />}
            {secondView && <CanvasWithBitmap imageBitmap={secondView} />}
        </div>
    );
};
