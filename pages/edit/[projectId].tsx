import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import styles from './editor.module.css';
import { useAltKey } from './useAltKey';

import useMinZoom from './useMinZoom';
import { useProject } from '../../hooks/useProject';
import { HeaderLayout } from '../../components/layout';
import { Header } from '../../components/header';
import { Sidebar } from './sidebar/sidebar';
import { PieceClickCallback, ProjectView } from '../../components/project';
import { useOnOffMachine } from '../../hooks/useOnOffMachine';
import { useEditorState } from './useEditorState';

interface Params {
    projectId: number;
}

const Editor = () => {
    const router = useRouter();
    let { projectId } = router.query;

    if (Array.isArray(projectId)) {
        projectId = projectId[0];
    }

    const [isLoading, project, projectMethods] = useProject(projectId);

    const [editorState, editorMethods] = useEditorState(projectId);

    const [sizeInfo, containerRef] = useMinZoom(project);
    const altDown = useAltKey();

    const nightMode = useOnOffMachine('off');
    const showLabels = useOnOffMachine('on');

    const handlePieceClick = useMemo<PieceClickCallback>(
        () => (event, pieceId) => {
            if (!project || !projectMethods) {
                return;
            }
            console.log('selection', editorState.selection);
            const piece = project.pieces.find((piece) => piece.id === pieceId);
            if (!piece) {
                return;
            }
            if (altDown) {
                editorMethods.selectGlass(piece.glass);
            } else {
                projectMethods.changePieceGlass(piece, editorState.selection);
            }
        },
        [project, editorState.selection, projectMethods, editorMethods]
    );

    if (isLoading || project === undefined || projectMethods === undefined) {
        return (
            <HeaderLayout>
                <Header>
                    <h1>Loading Project</h1>
                </Header>
                <div className={styles.container}></div>
            </HeaderLayout>
        );
    }

    // const [isLoading, project, projectMethods] = projectBundle;

    return (
        <HeaderLayout>
            <Header>
                <h1>{project.name}</h1>
            </Header>

            <div className={styles.layout} ref={containerRef}>
                <Sidebar
                    project={project}
                    editorState={editorState}
                    editorMethods={editorMethods}
                    projectMethods={projectMethods}
                />
                {sizeInfo.measured ? (
                    <ProjectView
                        scale={sizeInfo.minZoom}
                        project={project}
                        nightMode={nightMode.isOn}
                        showLabels={showLabels.isOn}
                        altIsDown={altDown}
                        onPieceClick={handlePieceClick}
                    />
                ) : (
                    'measuring...'
                )}
            </div>
        </HeaderLayout>
    );
};

export default Editor;
