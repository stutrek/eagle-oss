import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import { render } from 'react-dom';
import {
    Button,
    Checkbox,
    Dropdown,
    DropdownProps,
    Icon,
    Input,
    Label,
} from 'semantic-ui-react';
import { Color, Grayscale, Outlines } from '../../../components/genericProject';
import { ProjectView } from '../../../components/project';
import { Project } from '../../../data/types';
import { ProjectMethods } from '../../../hooks/useProject';

import styles from './toolbar.module.css';

type Props = {
    project: Project;
    projectMethods: ProjectMethods;
};

const unitOptions = [
    { key: 'in', value: 'in', text: 'in' },
    { key: 'cm', value: 'cm', text: 'cm' },
];

export function Export({ project }: Props) {
    const [units, setUnits] = useState('in');
    const [locked, setLocked] = useState(true);

    const [width, setWidth] = useState(project.width / project.ppi);
    const [height, setHeight] = useState(project.height / project.ppi);

    const [aspectRatio, setAspectRatio] = useState(width / height);

    const [colorSelection, setColorSelection] = useState<
        'color' | 'outline' | 'grayscale'
    >('color');

    const [showLabels, setShowLabels] = useState(true);

    const receiveWidth = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const newWidth = +event.currentTarget.value;
            setWidth(newWidth);

            if (locked && newWidth) {
                const newHeight = newWidth / aspectRatio;
                if (newHeight !== Infinity) {
                    setHeight(newHeight);
                }
            }
            if (!locked) {
                setAspectRatio(newWidth / height);
            }
        },
        [height, width, locked, aspectRatio]
    );
    const receiveHeight = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const newHeight = +event.currentTarget.value;
            setHeight(newHeight);

            if (locked && newHeight) {
                const newWidth = newHeight * aspectRatio;
                if (newWidth !== Infinity) {
                    setWidth(newWidth);
                }
            }
            if (!locked) {
                setAspectRatio(width / newHeight);
            }
        },
        [height, width, locked, aspectRatio]
    );

    const receiveUnits = useCallback(
        (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
            const newUnit = data.value as 'in' | 'cm';

            if (newUnit === units) {
                return;
            }

            const ratio = newUnit === 'cm' ? 2.54 : 1 / 2.54;

            setUnits(newUnit);
            setWidth(width * ratio);
            setHeight(height * ratio);
        },
        [height, width, units]
    );

    const renderProject = useCallback(
        (event: SyntheticEvent<HTMLAnchorElement>) => {
            const fixture = document.createElement('div');
            const renderedProject = render(
                <ProjectView
                    height={`${height}${units}`}
                    width={`${width}${units}`}
                    project={project}
                    showLabels={showLabels}
                    colorOverride={
                        colorSelection === 'outline' ? 'white' : undefined
                    }
                    grayscale={colorSelection === 'grayscale'}
                />,
                fixture
            );
            const svgString = fixture.innerHTML;

            const href = `data:image/svg+xml;utf-8,${escape(svgString)}`;

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
            <div className={styles.sizeForm}>
                <div className={styles.sizeContainer}>
                    <Input
                        value={parseFloat(width.toFixed(2)) || ''}
                        onChange={receiveWidth}
                        labelPosition="right"
                        type="text"
                        fluid
                    >
                        <Label basic>Width</Label>
                        <input />
                        <Label>
                            <Dropdown
                                onChange={receiveUnits}
                                options={unitOptions}
                                value={units}
                                item
                            />
                        </Label>
                    </Input>

                    <Input
                        value={parseFloat(height.toFixed(2)) || ''}
                        onChange={receiveHeight}
                        labelPosition="right"
                        type="text"
                        fluid
                    >
                        <Label basic>Height</Label>
                        <input />
                        <Label>
                            <Dropdown
                                onChange={receiveUnits}
                                options={unitOptions}
                                value={units}
                                item
                            />
                        </Label>
                    </Input>
                </div>
                <div className={styles.lockContainer}>
                    <Button
                        icon={locked ? 'chain' : 'broken chain'}
                        circular
                        onClick={() => setLocked(!locked)}
                    />
                </div>
            </div>
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
