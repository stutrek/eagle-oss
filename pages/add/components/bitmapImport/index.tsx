import { CanvasWithBitmap } from '../../../../components/CanvasWithBitmap';
import { ImageProcessorReturn } from '../../../../data/imageProcessor/useImageProcessor';
import { ImageStretcher } from '../imageStretcher';
import { PathDisplay } from '../PathDisplay';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

export const BitmapImport = ({ imageProcessor }: Props) => {
    const {
        imageBitmap,
        stretchedBitmap,
        outlineBitmap,
        paths,
        preliminaryProject,
    } = imageProcessor.bitmapImport;

    const secondView = !paths && (outlineBitmap || stretchedBitmap);
    return (
        <div>
            {imageBitmap && <ImageStretcher imageProcessor={imageProcessor} />}
            {secondView && <CanvasWithBitmap imageBitmap={secondView} />}
            {paths && stretchedBitmap && (
                <PathDisplay
                    size={[stretchedBitmap.width, stretchedBitmap.height]}
                    paths={paths}
                    preliminaryProject={preliminaryProject}
                    devicePixelRatio={1}
                />
            )}
        </div>
    );
};
