import { useCallback } from 'react';
import { Button, Checkbox, Form, Icon } from 'semantic-ui-react';

import { Viewport } from '../../../components/viewport';
import { EditorState, EditorStateMethods } from '../useEditorState';

import styles from './toolbar.module.css';

type Props = {
    editorState: EditorState;
    editorMethods: EditorStateMethods;
    viewport: Viewport;
};

export function Toolbar({ editorState, viewport, editorMethods }: Props) {
    const zoomIn = useCallback(() => {
        let nextLevel = Math.floor(viewport.zoom * 10 + 1) / 10;
        viewport.setZoom(nextLevel);
    }, [viewport.zoom]);
    const zoomOut = useCallback(() => {
        let nextLevel = Math.max(
            viewport.minZoom,
            Math.floor(viewport.zoom * 10 - 1) / 10
        );
        viewport.setZoom(nextLevel);
    }, [viewport.zoom]);

    return (
        <>
            <div>
                <Icon name="sun" size="large" />
                <Checkbox
                    toggle
                    checked={editorState.nightMode}
                    onChange={(event) =>
                        editorMethods.setNightMode(!editorState.nightMode)
                    }
                />
                <Icon name="moon" size="large" />
            </div>
            <hr />
            <div>
                <Checkbox
                    toggle
                    checked={editorState.showLabels}
                    onChange={(event) =>
                        editorMethods.setShowLabels(!editorState.showLabels)
                    }
                />{' '}
                Labels
            </div>
            <hr />
            <div>
                <Button
                    icon="minus"
                    size="tiny"
                    circular
                    disabled={viewport.zoom === viewport.minZoom}
                    onClick={zoomOut}
                />{' '}
                {Math.round(viewport.zoom * 100)}%{' '}
                <Button icon="plus" size="tiny" circular onClick={zoomIn} />
            </div>
        </>
    );
}
