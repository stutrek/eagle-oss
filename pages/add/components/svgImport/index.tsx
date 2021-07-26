import { useMemo, useState } from 'react';
import { keyBy } from 'lodash';
import chroma from 'chroma-js';
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

    const colors = useMemo(() => {
        if (!preliminaryProject) {
            return undefined;
        }
        const modifiedColors = preliminaryProject.colors.map((color) => ({
            ...color,
            color: chroma.lch(...color.color),
        }));
        return keyBy(modifiedColors, 'id');
    }, [preliminaryProject]);

    if (preliminaryProject && size && colors) {
        const { shapes } = preliminaryProject;
        return (
            <div className={styles.svgImportDisplay}>
                <svg
                    width={size[0] / window.devicePixelRatio}
                    height={size[1] / window.devicePixelRatio}
                    viewBox={`0 0 ${size[0]} ${size[1]}`}
                >
                    {shapes.map((shape) => (
                        <path
                            key={shape.path}
                            d={shape.path}
                            fill={colors[shape.color].color.hex()}
                        />
                    ))}
                </svg>
            </div>
        );
    }

    if (paths && size) {
        return (
            <div className={styles.svgImportDisplay}>
                <svg
                    width={size[0] / window.devicePixelRatio}
                    height={size[1] / window.devicePixelRatio}
                    viewBox={`0 0 ${size[0]} ${size[1]}`}
                >
                    {paths.map((path) => (
                        <path key={path} d={path} />
                    ))}
                </svg>
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
