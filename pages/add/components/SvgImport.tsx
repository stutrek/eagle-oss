import { CanvasWithBitmap } from '../../../components/CanvasWithBitmap';
import { ImageProcessorReturn } from '../../../data/imageProcessor/useImageProcessor';
import { ImageStretcher } from './imageStretcher';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

export const SvgImport = ({ imageProcessor }: Props) => {
    const { svgString, whiteSvgString, paths, size } = imageProcessor.svgImport;
    if (svgString === undefined) {
        return <div>Loading...</div>;
    }
    if (paths && size) {
        return (
            <div>
                <svg width={size[0]} height={size[1]}>
                    {paths.map((path) => (
                        <path key={path} d={path} />
                    ))}
                </svg>
            </div>
        );
    }
    return (
        <div>
            <img
                src={`data:image/svg+xml,${escape(
                    whiteSvgString || svgString
                )}`}
            />
        </div>
    );
};
