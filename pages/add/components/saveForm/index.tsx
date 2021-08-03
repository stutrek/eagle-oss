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
    title: string
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
        ppi: 72,
        dateCreated: new Date(),
        dateModified: new Date(),
    };
}

export function SaveForm({ preliminaryProject, imageProcessor }: Props) {
    const [savingInProgress, setSavingInProgress] = useState(false);
    const [title, setTitle] = useState(
        imageProcessor.upload.file?.name || 'Project'
    );

    const [height, setHeight] = useState(preliminaryProject.height);
    const [width, setWidth] = useState(preliminaryProject.width);

    const save = useCallback(async () => {
        if (savingInProgress) {
            return;
        }
        setSavingInProgress(true);
        const db = await getDb();
        const project = preliminaryProjectToTheRealThing(
            preliminaryProject,
            title
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
                    width
                    <Input
                        value={(width / 72).toFixed(2)}
                        label="in"
                        labelPosition="right"
                        onChange={(event) => setWidth(+event.target.value * 72)}
                    />
                </label>
                <label>
                    height
                    <Input
                        value={(height / 72).toFixed(2)}
                        label="in"
                        labelPosition="right"
                        onChange={(event) =>
                            setHeight(+event.target.value * 72)
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
