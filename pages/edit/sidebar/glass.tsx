import React, { SyntheticEvent, useMemo } from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import { Glass } from '../../../data/types';
import { ProjectMethods } from '../../../hooks/useProject';

import styles from '../editor.module.css';
import { EditorState, EditorStateMethods } from '../useEditorState';

type Props = {
    glass: Glass;
    editorState: EditorState;
    editorMethods: EditorStateMethods;
    projectMethods: ProjectMethods;
};

interface MenuItem {
    key: string;
    text: string;
    onClick: Function;
    icon?: string;
}

export const GlassRow = ({
    glass,
    editorState,
    editorMethods,
    projectMethods,
}: Props) => {
    const selectGlass = useMemo(
        () => () => {
            editorMethods.selectGlass(glass);
        },
        [glass, editorMethods]
    );

    const handleChange = useMemo(
        () =>
            (event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const target = event.target as HTMLInputElement;
                console.log(event);
                if (target.name in glass) {
                    let newGlass = {
                        ...glass,
                        color: target.value,
                    };
                    projectMethods.updateGlass(newGlass);
                }
            },
        [glass, projectMethods]
    );

    const addHighlight = useMemo(
        () => () => {
            editorMethods.highlightGlass(glass);
        },
        [glass, editorMethods]
    );

    const removeHighlight = useMemo(
        () => () => {
            editorMethods.highlightGlass(undefined);
        },
        [glass, editorMethods]
    );

    const moreOptionsMenu = useMemo(
        () => [
            {
                key: 'delete',
                text: 'Delete',
                onClick: () => {
                    if (
                        confirm(
                            `Are you sure you want to delete ${glass.title}?`
                        )
                    ) {
                        projectMethods.removeGlass(glass);
                    }
                },
                icon: undefined,
            },
        ],
        [projectMethods, glass]
    );

    let isSelected = editorState.selection === glass;
    let className = isSelected ? styles.glassSelected : styles.glassNotSelected;

    return (
        <tr className={className}>
            <td onClick={selectGlass} className={styles.colorCell}>
                <label
                    className={styles.color}
                    style={{ backgroundColor: glass.color }}
                >
                    <input
                        type="color"
                        name="color"
                        value={glass.color}
                        onChange={handleChange}
                        tabIndex={-1}
                    />
                </label>
            </td>
            <td onClick={selectGlass} className={styles.colorCell}>
                <label
                    className={glass.nightColor ? styles.color : styles.noColor}
                    style={{
                        backgroundColor: glass.nightColor || glass.color,
                    }}
                >
                    <input
                        type="color"
                        name="nightColor"
                        value={glass.nightColor || glass.color}
                        onChange={handleChange}
                        tabIndex={-1}
                    />
                </label>
            </td>
            <td onClick={selectGlass}>
                <textarea
                    className={styles.title}
                    name="title"
                    value={glass.title}
                    rows={2}
                    onChange={handleChange}
                    onFocus={addHighlight}
                    onBlur={removeHighlight}
                />
            </td>
            <td onClick={selectGlass}>
                <Dropdown
                    trigger={
                        <Icon
                            circular
                            name="ellipsis horizontal"
                            size="small"
                        />
                    }
                    icon={null}
                    options={moreOptionsMenu}
                    pointing="top right"
                />
            </td>
        </tr>
    );
};
