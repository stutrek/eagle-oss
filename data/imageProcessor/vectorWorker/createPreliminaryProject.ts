import { parseSVG, makeAbsolute, MoveToCommand } from 'svg-path-parser';
//@ts-ignore
import polylabel from '@mapbox/polylabel';
import paper from 'paper';
import FastAverageColor from 'fast-average-color';
import chroma from 'chroma-js';
import { v4 as uuid } from 'uuid';
import { PreliminaryProject, PreliminaryShape } from '../../types';

const fac = new FastAverageColor();

paper.setup(new paper.Size(1000, 1000));

type InternalPreliminaryColor = {
    id: string;
    shapeCount: number;
    color: chroma.Color;
};

const calculateLabelLocation = (path: string) => {
    const segmentStrings = path
        .split('M')
        .filter((s) => s)
        .map((s) => 'M' + s);

    const segments = segmentStrings.map((segment) => {
        const commands = makeAbsolute(parseSVG(segment)) as MoveToCommand[];
        const points = commands.map((p) => [p.x, p.y]);
        return points;
    });
    const poleOfInaccessibility: [number, number] = polylabel(segments);
    return poleOfInaccessibility;
};

const getColor = (
    context: OffscreenCanvasRenderingContext2D,
    labelLocation: [number, number],
    size: number,
    devicePixelRatio: number
) => {
    const imageData = context.getImageData(
        Math.round((labelLocation[0] - size / 4) / devicePixelRatio),
        Math.round((labelLocation[1] - size / 4) / devicePixelRatio),
        Math.floor(size / 2),
        Math.floor(size / 2)
    );

    const averageColor = fac.getColorFromArray4(imageData.data, {
        algorithm: 'dominant',
    });

    return averageColor;
};

export const createPreliminaryProject = (
    originalImage: ImageBitmap,
    paths: string[],
    devicePixelRatio: number
): PreliminaryProject => {
    const canvas = new OffscreenCanvas(
        originalImage.width,
        originalImage.height
    );
    const colorContext = canvas.getContext('2d');
    if (!colorContext) {
        throw new Error('no 2d!');
    }
    colorContext?.drawImage(originalImage, 0, 0);

    const colors: InternalPreliminaryColor[] = [];

    const shapes: PreliminaryShape[] = [];
    for (const pathString of paths) {
        const labelLocation = calculateLabelLocation(pathString);

        const paperPath = new paper.CompoundPath(pathString);
        const labelLocationPoint = new paper.Point(labelLocation);
        const closestPoint = paperPath.getNearestPoint(labelLocationPoint);
        const labelSize =
            closestPoint.getDistance(labelLocationPoint) * devicePixelRatio;

        if (labelSize < 3 * devicePixelRatio) {
            continue;
        }

        const averageColor = getColor(
            colorContext,
            labelLocation,
            Math.ceil(labelSize / 2),
            devicePixelRatio
        );

        let color: InternalPreliminaryColor | undefined;
        const chromaColor = chroma(
            averageColor[0],
            averageColor[1],
            averageColor[2]
        );

        for (const knownColor of colors) {
            const distance = chroma.deltaE(knownColor.color, chromaColor);

            if (distance === 0) {
                knownColor.shapeCount += 1;
                color = knownColor;
                break;
            } else if (distance < 3) {
                knownColor.shapeCount += 1;
                knownColor.color = chroma.mix(
                    knownColor.color,
                    chromaColor,
                    1 / knownColor.shapeCount,
                    'lab'
                );
                color = knownColor;
                break;
            }
        }
        if (color === undefined) {
            color = {
                id: uuid(),
                color: chromaColor,
                shapeCount: 1,
            };
            colors.push(color);
        }

        shapes.push({
            path: pathString,
            labelLocation,
            labelSize,
            color: color.id,
        });
    }

    const exportableColors = colors.map((color) => ({
        ...color,
        color: color.color.lch(),
    }));

    return {
        shapes,
        colors: exportableColors,
        width: originalImage.width * devicePixelRatio,
        height: originalImage.height * devicePixelRatio,
        ppi: 72 * devicePixelRatio,
    };
};
