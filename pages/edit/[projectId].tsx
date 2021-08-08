import React, { useLayoutEffect, useMemo } from 'react';
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
import Link from 'next/link';
import { useViewport } from '../../components/viewport';
import { Toolbar } from './toolbar';

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

    // const [sizeInfo, containerRef] = useMinZoom(project);
    const altDown = useAltKey();

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
                const glass = project.glasses.find(
                    (glass) => glass.id === piece.glass
                );
                editorMethods.selectGlass(glass);
            } else {
                projectMethods.changePieceGlass(piece, editorState.selection);
            }
        },
        [project, editorState.selection, projectMethods, editorMethods, altDown]
    );

    const viewport = useViewport();

    if (isLoading) {
        return (
            <HeaderLayout>
                <Header>
                    <h1>Loading Project</h1>
                </Header>
                <div className={styles.container}></div>
            </HeaderLayout>
        );
    }
    if (project === undefined || projectMethods === undefined) {
        return (
            <HeaderLayout>
                <Header>
                    <h1>Project Not Found</h1>
                </Header>
                <div className={styles.container}>
                    <Link href="/">
                        <a>Back to home</a>
                    </Link>
                </div>
            </HeaderLayout>
        );
    }

    const pieceCount = project.pieces.reduce(
        (acc, piece) => (piece.glass ? acc + 1 : acc),
        0
    );

    return (
        <HeaderLayout>
            <Header>
                <h1>{project.name}</h1>
                <hr />
                <div>{pieceCount} pieces</div>
                <hr />
                <div data-flex />
                <Toolbar
                    editorState={editorState}
                    editorMethods={editorMethods}
                    viewport={viewport}
                    project={project}
                    projectMethods={projectMethods}
                />
            </Header>

            <div className={styles.layout}>
                <Sidebar
                    project={project}
                    editorState={editorState}
                    editorMethods={editorMethods}
                    projectMethods={projectMethods}
                />
                <div className={styles.viewport}>
                    <div {...viewport.outerProps}>
                        <div {...viewport.innerProps}>
                            <ProjectView
                                inlineStyles={{ display: 'block' }}
                                project={project}
                                nightMode={editorState.nightMode}
                                showLabels={editorState.showLabels}
                                altIsDown={altDown}
                                onPieceClick={handlePieceClick}
                                highlightGlass={editorState.highlight?.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
};

export default Editor;
