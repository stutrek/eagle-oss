import React, { SyntheticEvent } from 'react';
import tinycolor from 'tinycolor2';
import { Glass, Piece } from '../../data/types';

interface LabelProps {
    piece: Piece;
    glass: Glass;
    handlePieceClick: (event: SyntheticEvent<Element>) => void;
    styles: any;
    numberSize: number;
    pieceColor: string;
}

export const Label = ({
    piece,
    glass,
    handlePieceClick,
    styles,
    numberSize,
    pieceColor,
}: LabelProps) => {
    let title = glass ? glass.title : '';
    const brightness = tinycolor(pieceColor).getBrightness();
    const isDark = brightness < 127;

    const textClass = isDark ? 'labelForDarkPiece' : 'labelForLightPiece';
    const strokeClass = isDark ? 'strokeForDarkPiece' : 'strokeForLightPiece';

    const titleLines = title.split('\n');

    numberSize = Math.max(numberSize, piece.labelSize * 0.5);
    numberSize = Math.min(numberSize, piece.labelSize * 0.75);
    if (titleLines.length > 1) {
        numberSize = numberSize * (1 - titleLines.length * 0.1);
    }
    const labelSize = numberSize / 4;

    let { x, y } = piece.labelCenter;
    y = y - (titleLines.length - 1) * (numberSize / 8);

    return (
        <g className={styles.labelGroup}>
            <text
                className={`label ${strokeClass}`}
                textAnchor="middle"
                x={x}
                y={y}
                data-id={piece.id}
                onClick={handlePieceClick}
                style={{
                    fontSize: numberSize + 'px',
                }}
            >
                {piece.label}
            </text>
            {title.split('\n').map((line, i) => (
                <text
                    key={`${i}-1`}
                    className={`label ${strokeClass}`}
                    textAnchor="middle"
                    x={x}
                    y={y + numberSize / 4 + labelSize * i}
                    data-id={piece.id}
                    onClick={handlePieceClick}
                    style={{
                        fontSize: labelSize + 'px',
                    }}
                >
                    {line}
                </text>
            ))}
            <text
                className={`label ${textClass}`}
                textAnchor="middle"
                x={x}
                y={y}
                data-id={piece.id}
                onClick={handlePieceClick}
                style={{
                    fontSize: numberSize + 'px',
                }}
            >
                {piece.label}
            </text>
            {titleLines.map((line, i) => (
                <text
                    key={`${i}-2`}
                    className={`label ${textClass}`}
                    textAnchor="middle"
                    x={x}
                    y={y + numberSize / 4 + labelSize * i}
                    data-id={piece.id}
                    onClick={handlePieceClick}
                    style={{
                        fontSize: labelSize + 'px',
                    }}
                >
                    {line}
                </text>
            ))}{' '}
        </g>
    );
};
