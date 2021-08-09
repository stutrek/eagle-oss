import { useState } from 'react';

import { PathDisplay } from '../pathDisplay';

import { ImageProcessorReturn } from '../../../data/imageProcessor/useImageProcessor';
import { HeaderLayout, ContentWithSidebar, Sidebar } from '../../layout';
import { Header } from '../../header';

import { ColorControlOption, ColorControls } from '../colorControls';

import styles from '../add.module.css';
import { SaveForm } from '../saveForm';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

type DisplaySvgProps = {
    imageProcessor: ImageProcessorReturn;
    colorOption: ColorControlOption;
    displayWidth?: string;
    displayHeight?: string;
};

export const DisplaySvg = ({
    imageProcessor,
    colorOption,
    displayWidth,
    displayHeight,
}: DisplaySvgProps) => {
    const { svgString, whiteSvgString, paths, size, preliminaryProject } =
        imageProcessor.svgImport;

    if (svgString === undefined) {
        return <div>Loading...</div>;
    }

    if (size && paths) {
        return (
            <div className={styles.importDisplay}>
                <PathDisplay
                    size={size}
                    paths={paths}
                    preliminaryProject={preliminaryProject}
                    colorOption={colorOption}
                    devicePixelRatio={window.devicePixelRatio}
                    displayWidth={displayWidth}
                    displayHeight={displayHeight}
                />
            </div>
        );
    }

    return (
        <div className={styles.importDisplay}>
            <img
                src={`data:image/svg+xml,${escape(
                    whiteSvgString || svgString
                )}`}
            />
        </div>
    );
};

function getClassName(thing: unknown) {
    if (thing) {
        return styles.done;
    }
    return styles.waiting;
}

export const SvgImport = ({ imageProcessor }: Props) => {
    const { svgString, whiteSvgString, paths, preliminaryProject } =
        imageProcessor.svgImport;
    const [colorOption, setColorOption] =
        useState<ColorControlOption>('original');

    const [displayWidth, setDisplayWidth] = useState<string | undefined>();
    const [displayHeight, setDisplayHeight] = useState<string | undefined>();

    return (
        <HeaderLayout>
            <Header>
                <h1>Importing SVG file</h1>
            </Header>
            <ContentWithSidebar>
                <Sidebar padding={true}>
                    <ul className={styles.progressList}>
                        <li className={getClassName(svgString)}>
                            Loading image
                        </li>
                        <li className={getClassName(whiteSvgString)}>
                            Converting to outlines
                        </li>
                        <li className={getClassName(paths)}>
                            Isolating shapes
                            {paths ? (
                                <div>{paths.length} pieces</div>
                            ) : (
                                <div>... pieces</div>
                            )}
                        </li>
                    </ul>
                    {paths && preliminaryProject && (
                        <>
                            <ColorControls
                                colorOption={colorOption}
                                setColorOption={setColorOption}
                            />
                            <hr />
                            <SaveForm
                                preliminaryProject={preliminaryProject}
                                imageProcessor={imageProcessor}
                                setDisplayWidth={setDisplayWidth}
                                setDisplayHeight={setDisplayHeight}
                            />
                        </>
                    )}
                </Sidebar>
                <DisplaySvg
                    imageProcessor={imageProcessor}
                    colorOption={colorOption}
                    displayWidth={displayWidth}
                    displayHeight={displayHeight}
                />
            </ContentWithSidebar>
        </HeaderLayout>
    );
};
