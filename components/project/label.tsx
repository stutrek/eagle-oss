import chroma from 'chroma-js';
import React, { SyntheticEvent } from 'react';
import { Glass, Piece } from '../../data/types';

interface LabelProps {
    piece: Piece;
    glass: Glass;
    handlePieceClick: (event: SyntheticEvent<Element>) => void;
    styles: { [index: string]: string };
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
    const title = glass ? glass.title : '';
    const brightness = chroma(pieceColor).luminance();
    const isDark = brightness < 0.4;

    const textClass = isDark ? 'labelForDarkPiece' : 'labelForLightPiece';
    const strokeClass = isDark ? 'strokeForDarkPiece' : 'strokeForLightPiece';

    const titleLines = title.split('\n');

    numberSize = Math.max(numberSize, piece.labelSize * 0.5);
    numberSize = Math.min(numberSize, piece.labelSize * 0.75);
    if (titleLines.length > 1) {
        numberSize = numberSize * (1 - titleLines.length * 0.1);
    }
    const labelSize = numberSize / 4;

    const { x } = piece.labelCenter;
    let { y } = piece.labelCenter;
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
            ))}
        </g>
    );
};
