import { CanvasWithBitmap } from '../../../components/CanvasWithBitmap';
import { ImageProcessorReturn } from '../../../data/imageProcessor/useImageProcessor';
import { ImageStretcher } from './imageStretcher';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

export const BitmapImport = ({ imageProcessor }: Props) => {
    const { imageBitmap, stretchedBitmap, outlineBitmap, paths } =
        imageProcessor.bitmapImport;

    const secondView = !paths && (outlineBitmap || stretchedBitmap);
    console.log({ paths });
    return (
        <div>
            {imageBitmap && <ImageStretcher imageProcessor={imageProcessor} />}
            {secondView && <CanvasWithBitmap imageBitmap={secondView} />}
            {paths && stretchedBitmap && (
                <svg
                    width={stretchedBitmap.width}
                    height={stretchedBitmap.height}
                >
                    {paths.map((path) => (
                        <path key={path} d={path} />
                    ))}
                </svg>
            )}
        </div>
    );
};
