import { CanvasWithBitmap } from '../../../../components/CanvasWithBitmap';
import { Header } from '../../../../components/header';
import {
    ContentWithSidebar,
    HeaderLayout,
    Sidebar,
} from '../../../../components/layout';
import { ImageProcessorReturn } from '../../../../data/imageProcessor/useImageProcessor';
import { ColorControlOption, ColorControls } from '../colorControls';
import { ImageStretcher } from '../imageStretcher';
import { PathDisplay } from '../pathDisplay';

import styles from '../../add.module.css';
import { useState } from 'react';
import { SaveForm } from '../saveForm';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

function getClassName(thing: any) {
    if (thing) {
        return styles.done;
    }
    return styles.waiting;
}

export const BitmapImport = ({ imageProcessor }: Props) => {
    const {
        imageBitmap,
        stretchedBitmap,
        outlineBitmap,
        paths,
        preliminaryProject,
    } = imageProcessor.bitmapImport;

    const [colorOption, setColorOption] =
        useState<ColorControlOption>('original');

    const secondView = !paths && (outlineBitmap || stretchedBitmap);
    return (
        <HeaderLayout>
            <Header>
                <h1>Importing Bitmap File</h1>
            </Header>
            <ContentWithSidebar>
                <Sidebar padding={true}>
                    <ul className={styles.progressList}>
                        <li className={getClassName(imageBitmap)}>
                            Loading image
                        </li>
                        <li className={getClassName(stretchedBitmap)}>
                            Correcting shape
                        </li>
                        <li className={getClassName(outlineBitmap)}>
                            Enhancing image
                        </li>
                        <li className={getClassName(paths)}>
                            Converting to outlines
                            {paths ? (
                                <div>{paths.length} pieces</div>
                            ) : (
                                <div>... pieces</div>
                            )}
                        </li>
                        <li className={getClassName(preliminaryProject)}>
                            Finding colors
                        </li>
                    </ul>
                    {paths && preliminaryProject && (
                        <>
                            <hr />
                            <ColorControls
                                colorOption={colorOption}
                                setColorOption={setColorOption}
                            />
                            <hr />
                            <SaveForm
                                preliminaryProject={preliminaryProject}
                                imageProcessor={imageProcessor}
                            />
                        </>
                    )}
                </Sidebar>
                <div className={styles.content}>
                    <div>
                        {imageBitmap && (
                            <ImageStretcher imageProcessor={imageProcessor} />
                        )}
                    </div>
                    <div className={styles.importDisplay}>
                        {secondView && (
                            <CanvasWithBitmap imageBitmap={secondView} />
                        )}
                        {paths && stretchedBitmap && (
                            <PathDisplay
                                size={[
                                    stretchedBitmap.width,
                                    stretchedBitmap.height,
                                ]}
                                paths={paths}
                                preliminaryProject={preliminaryProject}
                                devicePixelRatio={1}
                                colorOption={colorOption}
                            />
                        )}
                    </div>
                </div>
            </ContentWithSidebar>
        </HeaderLayout>
    );
};
