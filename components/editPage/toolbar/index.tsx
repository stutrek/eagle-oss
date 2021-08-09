import { useCallback } from 'react';
import { Button, Checkbox, Form, Icon, Popup } from 'semantic-ui-react';

import { Viewport } from '../../../components/viewport';
import { Project } from '../../../data/types';
import { ProjectMethods } from '../../../hooks/useProject';
import { EditorState, EditorStateMethods } from '../useEditorState';
import { Export } from './export';

type Props = {
    editorState: EditorState;
    editorMethods: EditorStateMethods;
    project: Project;
    projectMethods: ProjectMethods;
    viewport: Viewport;
};

export function Toolbar({
    editorState,
    viewport,
    editorMethods,
    project,
    projectMethods,
}: Props) {
    const zoomIn = useCallback(() => {
        const nextLevel = Math.floor(viewport.zoom * 10 + 1) / 10;
        viewport.setZoom(nextLevel);
    }, [viewport.zoom]);
    const zoomOut = useCallback(() => {
        const nextLevel = Math.max(
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
            <hr />
            <div>
                <Popup
                    trigger={
                        <Button icon>
                            Download <Icon name="triangle down" />
                        </Button>
                    }
                    position="bottom right"
                    on="click"
                    hoverable
                    flowing
                >
                    <Export project={project} projectMethods={projectMethods} />
                </Popup>
            </div>
        </>
    );
}
