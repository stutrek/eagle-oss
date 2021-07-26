import { useState } from 'react';

import { PathDisplay } from '../PathDisplay';

import { ImageProcessorReturn } from '../../../../data/imageProcessor/useImageProcessor';
import {
    HeaderLayout,
    ContentWithSidebar,
    Sidebar,
} from '../../../../components/layout';
import { Header } from '../../../../components/header';

import { ColorControlOption, ColorControls } from './colorControls';

import styles from '../../add.module.css';

type Props = {
    imageProcessor: ImageProcessorReturn;
};

export const DisplaySvg = ({ imageProcessor }: Props) => {
    const { svgString, whiteSvgString, paths, size, preliminaryProject } =
        imageProcessor.svgImport;

    if (svgString === undefined) {
        return <div>Loading...</div>;
    }

    if (size && paths) {
        return (
            <div className={styles.svgImportDisplay}>
                <PathDisplay
                    size={size}
                    paths={paths}
                    preliminaryProject={preliminaryProject}
                    devicePixelRatio={window.devicePixelRatio}
                />
            </div>
        );
    }

    return (
        <div className={styles.svgImportDisplay}>
            <img
                src={`data:image/svg+xml,${escape(
                    whiteSvgString || svgString
                )}`}
            />
        </div>
    );
};

function getClassName(thing: any) {
    if (thing) {
        return styles.done;
    }
    return styles.waiting;
}

export const SvgImport = ({ imageProcessor }: Props) => {
    const { svgString, whiteSvgString, paths, size } = imageProcessor.svgImport;
    const [colorOption, setColorOption] = useState<ColorControlOption>('white');
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
                        </li>
                    </ul>
                    {paths && (
                        <ColorControls
                            colorOption={colorOption}
                            setColorOption={setColorOption}
                        />
                    )}
                </Sidebar>
                <DisplaySvg imageProcessor={imageProcessor} />
            </ContentWithSidebar>
        </HeaderLayout>
    );
};
