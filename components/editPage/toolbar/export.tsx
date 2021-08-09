import { SyntheticEvent, useCallback, useState } from 'react';
import { Button, Checkbox, Icon } from 'semantic-ui-react';
import { Color, Grayscale, Outlines } from '../../../components/genericProject';
import { useSizeForm } from '../../../components/sizeForm';
import { rawRenderProject } from '../../../data/projectString';
import { Project } from '../../../data/types';
import { ProjectMethods } from '../../../hooks/useProject';

import styles from './toolbar.module.css';

type Props = {
    project: Project;
    projectMethods: ProjectMethods;
};

export function Export({ project }: Props) {
    const [colorSelection, setColorSelection] = useState<
        'color' | 'outline' | 'grayscale'
    >('color');

    const [showLabels, setShowLabels] = useState(true);

    const { height, width, units, sizeForm } = useSizeForm(
        project.width,
        project.height,
        project.ppi
    );

    const renderProject = useCallback(
        async (event: SyntheticEvent<HTMLAnchorElement>) => {
            const href = await rawRenderProject(
                project,
                colorSelection,
                showLabels,
                '2pt',
                `${width}${units}`,
                `${height}${units}`
            );

            event.currentTarget.href = href;
            if (colorSelection === 'color') {
                event.currentTarget.download = `${project.name}.svg`;
            } else {
                event.currentTarget.download = `${project.name} (${colorSelection}).svg`;
            }
        },
        [project, units, height, width, showLabels, colorSelection]
    );
    return (
        <div className={styles.export}>
            {sizeForm}
            <hr />
            <div className={styles.exportOptions}>
                <Button
                    basic={colorSelection !== 'color'}
                    color={colorSelection === 'color' ? 'blue' : undefined}
                    onClick={() => setColorSelection('color')}
                >
                    <Color />
                    Color
                </Button>
                <Button
                    basic={colorSelection !== 'outline'}
                    color={colorSelection === 'outline' ? 'blue' : undefined}
                    onClick={() => setColorSelection('outline')}
                >
                    <Outlines />
                    Outlines
                </Button>
                <Button
                    basic={colorSelection !== 'grayscale'}
                    color={colorSelection === 'grayscale' ? 'blue' : undefined}
                    onClick={() => setColorSelection('grayscale')}
                >
                    <Grayscale />
                    Grayscale
                </Button>
            </div>
            <hr />
            <Checkbox
                toggle
                checked={showLabels}
                onChange={() => setShowLabels(!showLabels)}
                label="Labels"
            />
            <hr />
            <Button size="large" fluid as="a" onMouseDown={renderProject}>
                Download File &nbsp;&nbsp;
                <Icon name="download" />
            </Button>
        </div>
    );
}
