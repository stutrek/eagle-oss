/* process

1. Import image
	- svg: string
	- bitmap: blob

2. Send image for processing
	- svg: make it b&w
	- bitmap: blur, etc.

3. Outline it
4. Flush turds
5. Use small squares to break shapes
6. Find centers
7. Show to user
*/

import { UploadButton } from './components/UploadButton';
import { useImageProcessor } from '../../data/imageProcessor/useImageProcessor';
import { BitmapImport } from './components/BitmapImport';

export default function AddPage() {
    const imageProcessor = useImageProcessor();

    if (imageProcessor.upload.file === undefined) {
        return <UploadButton listeners={imageProcessor.listeners} />;
    }

    if (
        imageProcessor.result.pieces === undefined &&
        imageProcessor.bitmapImport.imageBitmap
    ) {
        return <BitmapImport imageProcessor={imageProcessor} />;
    }

    if (
        imageProcessor.result.pieces === undefined &&
        imageProcessor.upload.svgString
    ) {
        return (
            <img
                src={`data:image/svg+xml,${escape(
                    imageProcessor.upload.svgString
                )}`}
            />
        );
    }

    return <div>what?</div>;
}
