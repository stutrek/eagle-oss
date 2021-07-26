import { useEffect, useMemo, useState } from 'react';
import { getDb } from '../data/db';
import { Glass, Piece, Project } from '../data/types';

type Methods = {
    addGlass: (glass: Glass) => Promise<Project>;
    updateGlass: (glass: Glass) => Promise<Project>;
    removeGlass: (glass: Glass) => Promise<Project>;
    changePieceGlass: (
        piece: Piece,
        glass: Glass | undefined
    ) => Promise<Project>;
};

type State =
    | {
          project: Project;
          isLoading: false;
      }
    | {
          project: undefined;
          isLoading: true;
      }
    | {
          project: undefined;
          isLoading: false;
      };

const initialState = {
    project: undefined,
    isLoading: true,
} as const;

const loading = 'loading' as const;

const createMethods = (
    project: Project,
    state: State,
    setState: (newState: State) => void
): Methods => {
    const saveProject = async (updated: Project) => {
        setState({
            project: updated,
            isLoading: false,
        });
        const db = getDb();
        db.projects.put(updated);
        return updated;
    };
    return {
        addGlass: (glass) => {
            const updated = {
                ...project,
                glasses: [...project.glasses, glass],
            };
            return saveProject(updated);
        },
        updateGlass: (glass) => {
            const updated = {
                ...project,
                glasses: project.glasses.map((item) =>
                    item.id === glass.id ? glass : item
                ),
            };
            return saveProject(updated);
        },
        removeGlass: (glass: Glass) => {
            const pieces = project.pieces.map((piece): Piece => {
                if (piece.glass === glass.id) {
                    return {
                        ...piece,
                        glass: undefined,
                    };
                }
                return piece;
            });
            const updated = {
                ...project,
                pieces,
                glasses: project.glasses.filter((item) => item.id !== glass.id),
            };
            return saveProject(updated);
        },
        changePieceGlass: (pieceToUpdate: Piece, glass: Glass | undefined) => {
            let pieces = project.pieces.map((item) => {
                if (item.id === pieceToUpdate.id) {
                    return {
                        ...pieceToUpdate,
                        glass: glass?.id,
                        label: '',
                    };
                }
                return item;
            });

            const piecesByGlass: Record<string, Piece[]> = {};
            const piecesById: Record<string, Piece> = {};

            for (const piece of pieces) {
                piecesById[piece.id] = piece;
                if (piece.glass === undefined) {
                    continue;
                }
                if (piecesByGlass[piece.glass] === undefined) {
                    piecesByGlass[piece.glass] = [];
                }
                piecesByGlass[piece.glass].push(piece);
            }

            let count = 0;
            for (const glass of project.glasses) {
                piecesByGlass[glass.id] = piecesByGlass[glass.id].map(
                    (piece) => {
                        const newlabel = `${++count}`;
                        if (piece.label === newlabel) {
                            return piece;
                        }
                        return (piecesById[piece.id] = {
                            ...piece,
                            label: newlabel,
                        });
                    }
                );
            }
            pieces = pieces.map((piece) => piecesById[piece.id]);

            const updated = {
                ...project,
                pieces,
            };

            return saveProject(updated);
        },
    };
};

export type ProjectMethods = ReturnType<typeof createMethods>;

export const useProject = (projectId: string | undefined) => {
    const [state, setState] = useState<State>(initialState);

    useEffect(() => {
        if (state !== initialState) {
            setState(initialState);
        }
        if (projectId === undefined) {
            return;
        }

        const db = getDb();

        db.projects.get(projectId).then((project) => {
            if (project === undefined) {
                setState({
                    project: undefined,
                    isLoading: false,
                });
                return;
            }
            setState({
                project,
                isLoading: false,
            });
        });
    }, [projectId]);

    const methods = useMemo(() => {
        if (state.project === undefined) {
            return undefined;
        }

        return createMethods(state.project, state, setState);
    }, [state, setState]);

    if (state.project) {
        return [state.isLoading, state.project, methods as Methods] as const;
    }

    return [state.isLoading, state.project, undefined] as const;
};
