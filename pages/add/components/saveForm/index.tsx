import router from 'next/router';
import { useCallback, useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';

import { getDb } from '../../../../data/db';
import { ImageProcessorReturn } from '../../../../data/imageProcessor/useImageProcessor';
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
    copyright: string,
    license: string
): Project {
    const glasses: Glass[] = preliminary.colors.map((color, i) => {
        return {
            color: color.color,
            title: `Color ${i}`,
            id: color.id,
        };
    });

    const pieces: Piece[] = preliminary.shapes.map((piece) => {
        return {
            id: uuid(),
            d: piece.path,
            glass: piece.color,
            label: '',
            labelCenter: arrayToPoint(piece.labelLocation),
            labelSize: piece.labelSize,
        };
    });
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
        license: license,
    };
}

export function SaveForm({ preliminaryProject, imageProcessor }: Props) {
    const [savingInProgress, setSavingInProgress] = useState(false);
    const [title, setTitle] = useState(
        imageProcessor.upload.file?.name || 'Project'
    );
    const [copyright, setCopyright] = useState(
        `©${new Date().getFullYear()} Your Name`
    );
    const [license, setLicense] = useState(`All Rights Reserved`);
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
            license
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
                        onChange={(event) => setCopyright(event.target.value)}
                        onBlur={() =>
                            copyright.trim() === '' && setCopyright('©')
                        }
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
            </Form.Field>{' '}
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
