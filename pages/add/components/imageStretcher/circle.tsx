import { SyntheticEvent, useEffect, useState } from 'react';
import {
    Point,
    UseImageBitmapReturn,
} from '../../../../data/imageProcessor/useBitmapImport';

type CircleProps = {
    side: keyof UseImageBitmapReturn['stretchOptions'];
    stretchState: UseImageBitmapReturn['stretchOptions'];
    setInterimCorner: UseImageBitmapReturn['setCorner'];
    setCorner: UseImageBitmapReturn['setCorner'];
};

const useDrag = (
    originalLocation: Point,
    side: keyof UseImageBitmapReturn['stretchOptions'],
    setInterimCorner: UseImageBitmapReturn['setCorner'],
    setCorner: UseImageBitmapReturn['setCorner']
) => {
    const [location, setInterimLocation] = useState(originalLocation);

    useEffect(() => {
        setInterimLocation(originalLocation);
    }, originalLocation);

    const [isDragging, setIsDragging] = useState(false);
    const [startingPoint, setStartingPoint] = useState<Point | undefined>();

    useEffect(() => {
        if (isDragging) {
            let xDelta = 0;
            let yDelta = 0;
            const windowMoveListener = (event: MouseEvent) => {
                if (startingPoint === undefined) {
                    throw new Error('Starting point of drag was not set.');
                }
                xDelta = event.screenX - startingPoint[0];
                yDelta = event.screenY - startingPoint[1];
                setInterimLocation([
                    originalLocation[0] + xDelta,
                    originalLocation[1] + yDelta,
                ]);
                setInterimCorner(side, [
                    originalLocation[0] + xDelta,
                    originalLocation[1] + yDelta,
                ]);
            };

            const windowUpListener = () => {
                setIsDragging(false);
                setStartingPoint(undefined);
                setCorner(side, [
                    originalLocation[0] + xDelta,
                    originalLocation[1] + yDelta,
                ]);
                window.removeEventListener('mousemove', windowMoveListener);
                window.removeEventListener('mouseup', windowUpListener);
            };

            window.addEventListener('mousemove', windowMoveListener);
            window.addEventListener('mouseup', windowUpListener);
        }
    }, [isDragging]);

    const onMouseDown = (event: MouseEvent) => {
        setIsDragging(true);
        setStartingPoint([event.screenX, event.screenY]);
    };

    return {
        location,
        onMouseDown,
    };
};

export const Circle = ({
    side,
    stretchState,
    setCorner,
    setInterimCorner,
}: CircleProps) => {
    const { location, onMouseDown } = useDrag(
        stretchState[side],
        side,
        setInterimCorner,
        setCorner
    );
    return (
        <circle
            cx={location[0]}
            cy={location[1]}
            r="10"
            // @ts-ignore
            onMouseDown={onMouseDown}
            fill="#f99"
        />
    );
};
