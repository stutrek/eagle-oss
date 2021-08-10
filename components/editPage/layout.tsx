import React, { useMemo } from 'react';
import Link from 'next/link';

import styles from '../../components/editPage/editor.module.css';
import { useAltKey } from '../../components/editPage/useAltKey';

import { useProject } from '../../hooks/useProject';
import { HeaderLayout } from '../../components/layout';
import { Header } from '../../components/header';
import { Sidebar } from '../../components/editPage/sidebar/sidebar';
import { PieceClickCallback, ProjectView } from '../../components/project';
import { useEditorState } from '../../components/editPage/useEditorState';
import { useViewport } from '../../components/viewport';
import { Toolbar } from '../../components/editPage/toolbar';
import Head from 'next/head';

type Props = {
    projectId: string;
};

export const Editor = ({ projectId }: Props) => {
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
                <Head>
                    <title>Eagle: Loading...</title>
                    <meta
                        name="description"
                        content="Eagle Stained Glass Editor"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
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
                <Head>
                    <title>Eagle: Project Not Found</title>
                    <meta
                        name="description"
                        content="Eagle Stained Glass Editor"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>{' '}
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

    return (
        <HeaderLayout>
            <Head>
                <title>Eagle: {project.name}</title>
                <meta name="description" content="Eagle Stained Glass Editor" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header>
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
