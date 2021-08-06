import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import {
    Button,
    Checkbox,
    Dropdown,
    DropdownProps,
    Input,
    Label,
} from 'semantic-ui-react';
import { Color, Grayscale, Outlines } from '../../../components/genericProject';
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

export function Export({ project, projectMethods }: Props) {
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
    return (
        <div className={styles.export}>
            <h2>Export {project.name}</h2>
            <hr />
            <h3>Size</h3>
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
            <h3>Color</h3>
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
            <h3>More Options</h3>
            <Checkbox
                toggle
                checked={showLabels}
                onChange={() => setShowLabels(!showLabels)}
                label="Labels"
            />
            <hr />
        </div>
    );
}
