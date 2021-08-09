import { UploadButton } from '../../components/addPage/UploadButton';
import { useImageProcessor } from '../../data/imageProcessor/useImageProcessor';
import { BitmapImport } from '../../components/addPage/bitmapImport';
import { SvgImport } from '../../components/addPage/svgImport';
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
