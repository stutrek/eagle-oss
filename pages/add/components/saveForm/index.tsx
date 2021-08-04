import router from 'next/router';
import { FocusEvent, useCallback, useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';

import { getDb } from '../../../../data/db';
import { ImageProcessorReturn } from '../../../../data/imageProcessor/useImageProcessor';
import { labelPieces } from '../../../../data/labelPieces';
import {
    Glass,
    Piece,
    Point,
    PreliminaryProject,
    Project,
} from '../../../../data/types';

type Props = {
    preliminaryProject: PreliminaryProject;
    imageProcessor: ImageProcessorReturn;
};

function arrayToPoint(arr: [number, number]): Point {
    return {
        x: arr[0],
        y: arr[1],
    };
}

function toTenth(n: number) {
    return Math.round(n * 10) / 10;
}

function preliminaryProjectToTheRealThing(
    preliminary: PreliminaryProject,
    title: string,
    copyright: string | undefined,
    license: string | undefined,
    link: string | undefined
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
    };
}

export function SaveForm({ preliminaryProject, imageProcessor }: Props) {
    const [savingInProgress, setSavingInProgress] = useState(false);
    const [title, setTitle] = useState(
        imageProcessor.upload.file?.name.replace(/\.[^.]+$/, '') || 'Project'
    );
    const [copyright, setCopyright] = useState<string | undefined>(undefined);
    const [license, setLicense] = useState(`All Rights Reserved`);
    const [link, setLink] = useState<string | undefined>();
    const [height, setHeight] = useState(preliminaryProject.height);
    const [width, setWidth] = useState(preliminaryProject.width);

    const { ppi } = preliminaryProject;

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
            link
        );
        db.projects.put(project);
        setSavingInProgress(false);
        router.push(`/edit/${project.id}`);
    }, [preliminaryProject, savingInProgress, title]);

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
                        value={license}
                        onChange={(event) => setLicense(event.target.value)}
                    />
                </label>
            </Form.Field>
            <Form.Field>
                <label>
                    link
                    <Input
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                    />
                </label>
            </Form.Field>
            <Form.Field>
                <label>
                    width
                    <Input
                        value={(width / ppi).toFixed(2)}
                        label="in"
                        labelPosition="right"
                        onChange={(event) =>
                            setWidth(+event.target.value * ppi)
                        }
                    />
                </label>
                <label>
                    height
                    <Input
                        value={(height / ppi).toFixed(2)}
                        label="in"
                        labelPosition="right"
                        onChange={(event) =>
                            setHeight(+event.target.value * ppi)
                        }
                    />
                </label>
            </Form.Field>
            <Form.Field>
                <Button fluid onClick={save}>
                    Save
                </Button>
            </Form.Field>
        </Form>
    );
}
