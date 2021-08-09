import React, { SyntheticEvent, useMemo } from 'react';
import { Label } from './label';
import { Glass, Piece } from '../../data/types';
import chroma from 'chroma-js';

interface PieceProps {
    piece: Piece;
    glass?: Glass;
    handlePieceClick: (event: SyntheticEvent<Element>) => void;
    styles: { [index: string]: string };
    numberSize: number;
    showLabels: boolean;
    nightMode: boolean;
    highlight: boolean;
    grayscale?: boolean;
    colorOverride?: string;
}

export const PieceView = (props: PieceProps) => {
    const {
        piece,
        glass,
        handlePieceClick,
        styles,
        showLabels,
        numberSize,
        highlight,
        nightMode,
        colorOverride,
        grayscale,
    } = props;

    const color = useMemo(() => {
        if (!glass) {
            return '#ffffff';
        }
        const colorToUse =
            nightMode && glass.nightColor ? glass.nightColor : glass.color;
        let color: chroma.Color;
        if (Array.isArray(colorToUse)) {
            color = chroma.lch(...colorToUse);
        } else {
            color = chroma(colorToUse);
        }
        if (colorOverride) {
            return colorOverride;
        } else if (grayscale) {
            return color.desaturate(100).hex();
        } else {
            return color.hex();
        }
    }, [glass, colorOverride, nightMode, grayscale]);

    const strokeWidth = glass ? '1px' : '0px';
    let className = glass ? styles.piece : styles.emptySpace;

    if (highlight) {
        className += ` ${styles.highlighted}`;
    }

    return (
        <g>
            <path
                className={`piece ${className}`}
                d={piece.d}
                fill={color}
                stroke="black"
                strokeWidth={strokeWidth}
                data-id={piece.id}
                onClick={handlePieceClick}
            />
            {glass && showLabels ? (
                <Label
                    piece={piece}
                    glass={glass}
                    handlePieceClick={handlePieceClick}
                    styles={styles}
                    numberSize={numberSize}
                    pieceColor={color}
                />
            ) : null}
        </g>
    );
};
