import React, { SyntheticEvent, useMemo } from 'react';
import { Label } from './label';
import tinycolor from 'tinycolor2';
import { Glass, Piece } from '../../data/types';

interface PieceProps {
    piece: Piece;
    glass?: Glass;
    handlePieceClick: (event: SyntheticEvent<Element>) => void;
    styles: any;
    numberSize: number;
    showLabels: boolean;
    nightMode: boolean;
    highlight: boolean;
    grayscale?: boolean;
    colorOverride?: string;
}

export const PieceView = (props: PieceProps) => {
    let {
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
        } else if (colorOverride) {
            return colorOverride;
        } else if (grayscale) {
            return tinycolor(glass.color).desaturate(100).toString();
        } else if (nightMode) {
            return glass.nightColor || glass.color;
        } else {
            return glass.color;
        }
    }, [glass, colorOverride, nightMode, grayscale]);

    let strokeWidth = glass ? '1px' : '0px';
    let className = glass ? styles.piece : styles.emptySpace;

    if (highlight) {
        className += ` ${styles.highlighted}`;
    }

    return (
        <g>
            <path
                className={className}
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
