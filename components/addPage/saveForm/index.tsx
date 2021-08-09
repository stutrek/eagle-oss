import router from 'next/router';
import { FocusEvent, useCallback, useEffect, useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';

import { getDb } from '../../../data/db';
import { ImageProcessorReturn } from '../../../data/imageProcessor/useImageProcessor';
import { labelPieces } from '../../../data/labelPieces';
import {
    Glass,
    Piece,
    Point,
    PreliminaryProject,
    Project,
} from '../../../data/types';
import { useSizeForm } from '../../sizeForm';

type Props = {
    preliminaryProject: PreliminaryProject;
    imageProcessor: ImageProcessorReturn;
    setDisplayWidth: (newDisplayWidth: string) => unknown;
    setDisplayHeight: (newDisplayHeight: string) => unknown;
};

function arrayToPoint(arr: [number, number]): Point {
    return {
        x: arr[0],
        y: arr[1],
    };
}

function preliminaryProjectToTheRealThing(
    preliminary: PreliminaryProject,
    title: string,
    copyright: string | undefined,
    license: string | undefined,
    link: string | undefined,
    displayWidth: number,
    displayHeight: number,
    displayUnits: string
): Project {
    const glasses: Glass[] = preliminary.colors.map((color, i) => {
        return {
            color: color.color,
            title: `Color ${i + 1}`,
            id: color.id,
        };
    });

    const unlabeledPieces: Piece[] = preliminary.shapes.map((piece) => {
        return {
            id: uuid(),
            d: piece.path,
            glass: piece.color,
            label: '',
            labelCenter: arrayToPoint(piece.labelLocation),
            labelSize: piece.labelSize,
        };
    });

    const pieces = labelPieces(unlabeledPieces, glasses);

    return {
        id: uuid(),
        glasses,
        pieces,
        name: title,
        width: preliminary.width,
        height: preliminary.height,
        ppi: preliminary.ppi,
        dateCreated: new Date(),
        dateModified: new Date(),
        copyright: copyright === '©' ? '' : copyright,
        license,
        link,
        displayWidth: `${displayWidth}${displayUnits}`,
        displayHeight: `${displayHeight}${displayUnits}`,
    };
}

export function SaveForm({
    preliminaryProject,
    imageProcessor,
    setDisplayWidth,
    setDisplayHeight,
}: Props) {
    const [savingInProgress, setSavingInProgress] = useState(false);
    const [title, setTitle] = useState(
        imageProcessor.upload.file?.name.replace(/\.[^.]+$/, '') || 'Project'
    );
    const [copyright, setCopyright] = useState<string | undefined>(undefined);
    const [license, setLicense] = useState(``);
    const [link, setLink] = useState<string | undefined>();

    const { height, width, units, sizeForm } = useSizeForm(
        preliminaryProject.width,
        preliminaryProject.height,
        preliminaryProject.ppi
    );

    console.log({ height, width, units });

    useEffect(() => {
        setDisplayWidth(`${width}${units}`);
    }, [width, units, setDisplayWidth]);

    useEffect(() => {
        setDisplayHeight(`${height}${units}`);
    }, [height, units, setDisplayHeight]);

    const save = useCallback(async () => {
        if (savingInProgress) {
            return;
        }
        setSavingInProgress(true);
        const db = await getDb();
        const project = preliminaryProjectToTheRealThing(
            preliminaryProject,
            title,
            copyright,
            license,
            link,
            width,
            height,
            units
        );
        db.projects.put(project);
        setSavingInProgress(false);
        router.push(`/edit/${project.id}`);
    }, [
        preliminaryProject,
        savingInProgress,
        title,
        width,
        height,
        units,
        copyright,
        license,
        link,
    ]);

    return (
        <Form>
            <h3>Save</h3>
            <Form.Field>
                <label>
                    title
                    <Input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </label>
            </Form.Field>
            <Form.Field>
                <label>
                    Copyright
                    <Input
                        value={copyright}
                        placeholder={`©${new Date().getFullYear()} Your Name`}
                        onChange={(event) => {
                            if (event.target.value) {
                                setCopyright(event.target.value);
                            } else {
                                setCopyright('©');
                            }
                        }}
                        onFocus={(event: FocusEvent<HTMLInputElement>) => {
                            if (!copyright) {
                                event.target.value = '©';
                                setTimeout(() => {
                                    event.target.setSelectionRange(1, 1);
                                }, 50);
                            }
                        }}
                        onBlur={(event: FocusEvent<HTMLInputElement>) => {
                            if (event.target.value === '©' || !copyright) {
                                event.target.value = '';
                                setCopyright(undefined);
                            }
                        }}
                    />
                </label>
            </Form.Field>
            <Form.Field>
                <label>
                    license
                    <Input
                        placeholder="e.g. Creative Commons"
                        value={license}
                        onChange={(event) => setLicense(event.target.value)}
                    />
                </label>
            </Form.Field>
            <Form.Field>
                <label>
                    link
                    <Input
                        placeholder="http://your.website"
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                    />
                </label>
            </Form.Field>
            <Form.Field>{sizeForm}</Form.Field>
            <Form.Field>
                <Button fluid onClick={save}>
                    Save
                </Button>
            </Form.Field>
        </Form>
    );
}
