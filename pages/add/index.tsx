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
import { BitmapImport } from './components/bitmapImport';
import { SvgImport } from './components/svgImport';
import { HeaderLayout } from '../../components/layout';
import { Header } from '../../components/header';

export default function AddPage() {
    const imageProcessor = useImageProcessor();

    if (imageProcessor.upload.file === undefined) {
        return (
            <HeaderLayout>
                <Header>
                    <h1>Import a Pattern</h1>
                </Header>
                <div>
                    <UploadButton
                        listeners={imageProcessor.listeners}
                        errorMessage={imageProcessor.upload.errorMessage}
                    />
                </div>
            </HeaderLayout>
        );
    }

    if (
        imageProcessor.result.pieces === undefined &&
        imageProcessor.bitmapImport.imageBitmap
    ) {
        return <BitmapImport imageProcessor={imageProcessor} />;
    }

    if (imageProcessor.svgImport.svgString !== undefined) {
        return <SvgImport imageProcessor={imageProcessor} />;
    }

    return <div>what?</div>;
}
