import React, { useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { GlassRow } from './glass';
import { NoneGlassRow } from './noneGlass';

import styles from '../editor.module.css';

import { EditorState, EditorStateMethods } from '../useEditorState';
import { ProjectMethods } from '../../../hooks/useProject';
import { Glass, Project } from '../../../data/types';

interface Props {
    project: Project;
    editorState: EditorState;
    editorMethods: EditorStateMethods;
    projectMethods: ProjectMethods;
}

export const Sidebar = ({
    project,
    editorState,
    editorMethods,
    projectMethods,
}: Props) => {
    const addGlass = useMemo(
        () => () => {
            const glass: Glass = {
                id: uuid(),
                color: '#999999',
                nightColor: undefined,
                title: 'New Glass',
            };
            projectMethods.addGlass(glass);
            editorMethods.selectGlass(glass);
        },
        [editorMethods, projectMethods]
    );

    return (
        <div className={styles.sidebar}>
            {/* <button>Undo</button>
			<button>Redo</button> */}
            <table className={styles.glassTable}>
                <thead>
                    <tr>
                        <td className={styles.center}>Day</td>
                        <td className={styles.center}>Night</td>
                        <td>Title</td>
                        <td />
                    </tr>
                </thead>
                <tbody>
                    <NoneGlassRow
                        editorState={editorState}
                        editorMethods={editorMethods}
                        projectMethods={projectMethods}
                    />
                    {project.glasses.map((glass) => (
                        <GlassRow
                            key={glass.id}
                            glass={glass}
                            editorState={editorState}
                            editorMethods={editorMethods}
                            projectMethods={projectMethods}
                        />
                    ))}
                </tbody>
            </table>
            <div onClick={addGlass} className={styles.sidebarButton}>
                + New Glass
            </div>
        </div>
    );
};
