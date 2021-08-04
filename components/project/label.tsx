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
    const labelColor = isDark ? 'white' : 'black';
    const strokeColor = isDark ? 'black' : 'white';
    const strokeWidth = '2pt';

    const textClass = isDark ? 'labelForDarkPiece' : 'labelForLightPiece';
    const strokeClass = isDark ? 'strokeForDarkPiece' : 'strokeForLightPiece';

    numberSize = Math.max(numberSize, piece.labelSize * 0.5);
    numberSize = Math.min(numberSize, piece.labelSize * 0.75);
    const labelSize = numberSize / 2;

    return (
        <g className={styles.labelGroup}>
            <text
                className={`label ${strokeClass}`}
                textAnchor="middle"
                x={piece.labelCenter.x}
                y={piece.labelCenter.y}
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
                    x={piece.labelCenter.x}
                    y={piece.labelCenter.y + numberSize / 2 + labelSize * i}
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
                x={piece.labelCenter.x}
                y={piece.labelCenter.y}
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
                    key={`${i}-2`}
                    className={`label ${textClass}`}
                    textAnchor="middle"
                    x={piece.labelCenter.x}
                    y={piece.labelCenter.y + numberSize / 2 + labelSize * i}
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
