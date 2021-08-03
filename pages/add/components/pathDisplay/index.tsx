import { useCallback, useMemo } from 'react';
import { keyBy } from 'lodash';
import chroma from 'chroma-js';
import { PreliminaryProject, PreliminaryShape } from '../../../../data/types';
import { ColorControlOption } from '../colorControls';

import styles from './pathdisplay.module.css';

type PathDisplayProps = {
    paths: string[];
    size: [number, number];
    preliminaryProject?: PreliminaryProject;
    devicePixelRatio: number;
    colorOption: ColorControlOption;
};

export function PathDisplay({
    paths,
    size,
    preliminaryProject,
    devicePixelRatio,
    colorOption,
}: PathDisplayProps) {
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

    const getColor = useCallback(
        (shape: PreliminaryShape) => {
            if (!colors) {
                return '#ffffff';
            }
            switch (colorOption) {
                case 'original':
                    return colors[shape.color].color.hex();
                case 'white':
                    return '#ffffff';
                case 'random':
                    return chroma.random().hex();
                case 'location':
                    return chroma(
                        (shape.labelLocation[0] / size[0]) * 255,
                        (shape.labelLocation[1] / size[1]) * 255,
                        0
                    ).hex();
            }
        },
        [colors, colorOption, size]
    );

    if (preliminaryProject && colors) {
        const { shapes } = preliminaryProject;
        return (
            <svg
                width={size[0] / devicePixelRatio}
                height={size[1] / devicePixelRatio}
                viewBox={`0 0 ${size[0]} ${size[1]}`}
                className={styles.svgContainer}
            >
                {shapes.map((shape) => (
                    <path
                        key={shape.path}
                        d={shape.path}
                        fill={getColor(shape)}
                    />
                ))}
            </svg>
        );
    }

    return (
        <svg
            width={size[0] / devicePixelRatio}
            height={size[1] / devicePixelRatio}
            viewBox={`0 0 ${size[0]} ${size[1]}`}
        >
            {paths.map((path) => (
                <path key={path} d={path} />
            ))}
        </svg>
    );
}
