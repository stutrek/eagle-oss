import { useMemo } from 'react';
import { keyBy } from 'lodash';
import chroma from 'chroma-js';
import { PreliminaryProject } from '../../../data/imageProcessor/vectorWorker/createPreliminaryProject';

type PathDisplayProps = {
    paths: string[];
    size: [number, number];
    preliminaryProject?: PreliminaryProject;
    devicePixelRatio: number;
};

export function PathDisplay({
    paths,
    size,
    preliminaryProject,
    devicePixelRatio,
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

    if (preliminaryProject && colors) {
        const { shapes } = preliminaryProject;
        return (
            <svg
                width={size[0] / devicePixelRatio}
                height={size[1] / devicePixelRatio}
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
