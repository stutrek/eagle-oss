import React, { useCallback, SyntheticEvent, useMemo } from 'react';
import { Glass, Project } from '../../data/types';

import { PieceView } from './piece';

import styles from './project.module.css';

export type PieceClickCallback = (
    event: SyntheticEvent<Element>,
    pieceId: string
) => void;

interface ProjectProps {
    onPieceClick?: PieceClickCallback;
    className?: string;
    showLabels?: boolean;
    scale?: number;
    interactive?: boolean;
    project: Project;
    highlightGlass?: string;
    nightMode?: boolean;
    colorOverride?: string;
    grayscale?: boolean;
    inlineStyles?: any;
    altIsDown?: boolean;
}

export const ProjectView = ({
    onPieceClick = (event: SyntheticEvent<Element>, pieceId: string) => {},
    className = '',
    showLabels = false,
    scale = 1,
    interactive = true,
    nightMode = false,
    colorOverride,
    grayscale = false,
    highlightGlass,
    project,
    inlineStyles,
    altIsDown = false,
}: ProjectProps) => {
    const { pieces, glasses } = project;

    const handlePieceClick = useCallback(
        (event: SyntheticEvent<Element>) => {
            if (onPieceClick) {
                let id = event.currentTarget.getAttribute('data-id');
                if (id) {
                    onPieceClick(event, id);
                }
            }
        },
        [onPieceClick]
    );

    const nonInteractiveClassName = interactive ? '' : styles.nonInteractive;

    const glassMap: Map<string, Glass> = useMemo(
        () =>
            glasses.reduce((acc, glass) => {
                acc.set(glass.id, glass);
                return acc;
            }, new Map()),
        [glasses]
    );

    let width = (project.width / project.ppi) * scale;
    let height = (project.height / project.ppi) * scale;

    let numberSize = project.ppi / 8;

    return (
        <svg
            id="svg"
            className={`${
                styles.container
            } ${className} ${nonInteractiveClassName} ${
                altIsDown ? styles.altDown : ''
            }`}
            version="1.1"
            width={width + 'in'}
            height={height + 'in'}
            viewBox={`0 0 ${project.width} ${project.height}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            style={inlineStyles}
        >
            {pieces.map((piece) => (
                <PieceView
                    key={piece.id}
                    styles={styles}
                    piece={piece}
                    handlePieceClick={handlePieceClick}
                    glass={piece.glass ? glassMap.get(piece.glass) : undefined}
                    numberSize={numberSize}
                    colorOverride={colorOverride}
                    grayscale={grayscale}
                    showLabels={showLabels}
                    highlight={
                        !!(highlightGlass && highlightGlass === piece.glass)
                    }
                    nightMode={nightMode}
                />
            ))}
        </svg>
    );
};