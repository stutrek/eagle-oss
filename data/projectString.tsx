import { Piece, Project } from './types';
import { render } from 'react-dom';
import { ProjectView } from '../components/project';

type CacheEntry = {
    [index: string]: Promise<string>;
};

export type ColorOption = 'color' | 'outline' | 'grayscale';

const cache = new WeakMap<Project, CacheEntry>();

export function rawRenderProject(
    project: Project,
    colorSelection: ColorOption,
    showLabels: boolean,
    strokeWidth?: string,
    widthOverride?: string,
    heightOverride?: string
) {
    return new Promise<string>((resolve) => {
        const fixture = document.createElement('div');
        const height =
            heightOverride ||
            project.displayHeight ||
            `${project.height / project.ppi}in`;
        const width =
            widthOverride ||
            project.displayWidth ||
            `${project.width / project.ppi}in`;

        render(
            <ProjectView
                displayHeight={height}
                displayWidth={width}
                project={project}
                showLabels={showLabels}
                strokeWidth={strokeWidth}
                colorOverride={
                    colorSelection === 'outline' ? 'white' : undefined
                }
                grayscale={colorSelection === 'grayscale'}
            />,
            fixture,
            () => {
                const svgString = fixture.innerHTML;
                const href = `data:image/svg+xml;utf-8,${escape(svgString)}`;

                resolve(href);
            }
        );
    });
}

export function renderProject(
    project: Project,
    color: ColorOption,
    labels: boolean,
    strokeWidth = '2pt'
) {
    const key = `${color}-${labels ? 'labels' : 'nolabels'}-${strokeWidth}`;

    let entry = cache.get(project);
    if (entry === undefined) {
        entry = {};
        cache.set(project, entry);
    }

    if (entry[key] === undefined) {
        entry[key] = rawRenderProject(project, color, labels, strokeWidth);
    }

    return entry[key];
}
