import { ChangeEvent, useCallback, useState } from 'react';
import { Button, Dropdown, Input, Label } from 'semantic-ui-react';
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
    return (
        <div className={styles.export}>
            <h2>Export {project.name}</h2>
            <hr />
            <h3>Size</h3>

            <div className={styles.sizeForm}>
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
                            onChange={(event, data) =>
                                setUnits(data.value as 'in' | 'cm')
                            }
                            options={unitOptions}
                            value={units}
                            item
                        />
                    </Label>
                </Input>

                <Button
                    icon={locked ? 'chain' : 'broken chain'}
                    circular
                    onClick={() => setLocked(!locked)}
                />

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
                            onChange={(event, data) =>
                                setUnits(data.value as 'in' | 'cm')
                            }
                            options={unitOptions}
                            value={units}
                            item
                        />
                    </Label>
                </Input>
            </div>

            <hr />
            <h3>Download</h3>
            <div className={styles.exportOptions}>
                <div className={styles.exportOption}>Color</div>
                <div className={styles.exportOption}>Outlines</div>
                <div className={styles.exportOption}>Grayscale</div>
            </div>
        </div>
    );
}
