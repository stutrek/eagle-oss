import {
    Point,
    StretchOptions,
} from '../../../data/imageProcessor/useBitmapImport';

type Props = {
    points: StretchOptions;
    divisions: number;
};

function getDivisions(a: Point, b: Point, divisions: number) {
    const increment0 = (b[0] - a[0]) / divisions;
    const increment1 = (b[1] - a[1]) / divisions;
    const points: Point[] = [];
    for (let i = 1; i < divisions; i++) {
        points.push([a[0] + increment0 * i, a[1] + increment1 * i]);
    }

    return points;
}

export function Grid({ points, divisions }: Props) {
    const topDivisionPoints = getDivisions(
        points.topLeft,
        points.topRight,
        divisions
    );
    const bottomDivisionPoints = getDivisions(
        points.bottomLeft,
        points.bottomRight,
        divisions
    );

    const leftDivisionPoints = getDivisions(
        points.topLeft,
        points.bottomLeft,
        divisions
    );
    const rightDivisionPoints = getDivisions(
        points.topRight,
        points.bottomRight,
        divisions
    );

    const verticalLines = topDivisionPoints.map((point, i) => {
        return [point, bottomDivisionPoints[i]];
    });
    const horizontalLines = leftDivisionPoints.map((point, i) => {
        return [point, rightDivisionPoints[i]];
    });

    return (
        <>
            {verticalLines.map(([start, end], i) => (
                <line
                    key={i}
                    x1={start[0]}
                    y1={start[1]}
                    x2={end[0]}
                    y2={end[1]}
                />
            ))}
            {horizontalLines.map(([start, end], i) => (
                <line
                    key={i}
                    x1={start[0]}
                    y1={start[1]}
                    x2={end[0]}
                    y2={end[1]}
                />
            ))}
        </>
    );
}
