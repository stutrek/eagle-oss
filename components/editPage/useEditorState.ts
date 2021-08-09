import { useEffect } from 'react';
import { useMethods } from 'react-use';

import { Glass } from '../../data/types';

export type EditorState = {
    selection: Glass | undefined;
    highlight: Glass | undefined;
    nightMode: boolean;
    showLabels: boolean;
};

const initialState: EditorState = {
    selection: undefined,
    highlight: undefined,
    nightMode: false,
    showLabels: true,
};

const createMethods = (state: EditorState) => {
    return {
        reset() {
            return initialState;
        },
        selectGlass(glass: Glass | undefined) {
            return {
                ...state,
                selection: glass,
            };
        },
        highlightGlass(glass: Glass | undefined) {
            return {
                ...state,
                highlight: glass,
            };
        },
        setNightMode(newValue: boolean) {
            return {
                ...state,
                nightMode: newValue,
            };
        },
        setShowLabels(newValue: boolean) {
            return {
                ...state,
                showLabels: newValue,
            };
        },
    } as const;
};

export const useEditorState = (projectId: string | undefined) => {
    const [state, methods] = useMethods(createMethods, initialState);
    useEffect(() => {
        if (state !== initialState) {
            methods.reset();
        }
    }, [projectId]);

    return [state, methods] as const;
};

export type EditorStateMethods = ReturnType<typeof useEditorState>[1];
