import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import {
    Button,
    Dropdown,
    DropdownProps,
    Input,
    Label,
} from 'semantic-ui-react';
import styles from './sizeForm.module.css';

const unitOptions = [
    { key: 'in', value: 'in', text: 'in' },
    { key: 'cm', value: 'cm', text: 'cm' },
];

export function useSizeForm(initialWidth: string, initialHeight: string) {
    const [units, setUnits] = useState(
        initialWidth.includes('in') ? 'in' : 'cm'
    );
    const [locked, setLocked] = useState(true);

    const [width, setWidth] = useState(parseFloat(initialWidth));
    const [height, setHeight] = useState(parseFloat(initialHeight));

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
        [height, locked, aspectRatio]
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
        [width, locked, aspectRatio]
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

    const sizeForm = (
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
                    basic
                    size="mini"
                    onClick={() => setLocked(!locked)}
                />
            </div>
        </div>
    );

    return {
        height,
        width,
        aspectRatio,
        units,
        sizeForm,
    };
}
