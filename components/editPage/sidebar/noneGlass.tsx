// @flow

import React, { useMemo } from 'react';
import styles from '../editor.module.css';
import { Icon } from 'semantic-ui-react';

import { EditorState, EditorStateMethods } from '../useEditorState';
import { ProjectMethods } from '../../../hooks/useProject';

type Props = {
    editorState: EditorState;
    editorMethods: EditorStateMethods;
    projectMethods: ProjectMethods;
};

export const NoneGlassRow = ({ editorState, editorMethods }: Props) => {
    const selectGlass = useMemo(
        () => () => {
            editorMethods.selectGlass(undefined);
        },
        [editorMethods]
    );

    const isSelected = editorState.selection === undefined;
    const className = isSelected
        ? styles.glassSelected
        : styles.glassNotSelected;

    return (
        <tr className={className} onClick={selectGlass}>
            <td>
                <span className={styles.icon}>
                    <Icon name="times circle" size="big" />
                </span>
            </td>
            <td>
                <span className={styles.icon}>
                    <Icon name="times circle" size="big" />
                </span>
            </td>
            <td>
                <div className={styles.title}>Empty Space</div>
            </td>
            <td />
        </tr>
    );
};
