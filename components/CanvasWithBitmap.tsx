import React, { useLayoutEffect, useRef } from 'react';

type Props = {
    imageBitmap: ImageBitmap;
    style?: React.StyleHTMLAttributes<HTMLCanvasElement>;
    className?: string;
};
export const CanvasWithBitmap = ({ imageBitmap, style, className }: Props) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {
        if (ref.current) {
            const context = ref.current.getContext('2d');
            context?.drawImage(imageBitmap, 0, 0);
        }
    }, [imageBitmap]);

    return (
        <canvas
            ref={ref}
            style={style}
            className={className}
            width={imageBitmap.width}
            height={imageBitmap.height}
        />
    );
};
