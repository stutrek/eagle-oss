import { useCallback, useMemo, useState } from 'react';
import { Form, Tab, Table } from 'semantic-ui-react';
import { Project } from '../../../data/types';
import { ProjectMethods } from '../../../hooks/useProject';
import { useSizeForm } from '../../sizeForm';

import styles from './toolbar.module.css';

type Props = {
    project: Project;
    projectMethods: ProjectMethods;
};

export function Info({ project, projectMethods }: Props) {
    const MemoizedEdit = useCallback(
        () => <Edit project={project} projectMethods={projectMethods} />,
        [project, projectMethods]
    );

    const MemoizedInfo = useCallback(
        () => <ProjectInfo project={project} projectMethods={projectMethods} />,
        [project, projectMethods]
    );

    const panes = useMemo(
        () => [
            {
                menuItem: 'Info',
                render: function InfoTab() {
                    return <MemoizedInfo />;
                },
            },
            {
                menuItem: 'Edit',
                render: function EditTab() {
                    return <MemoizedEdit />;
                },
            },
        ],
        [MemoizedEdit, MemoizedInfo]
    );

    return (
        <div className={styles.infoContainer}>
            <Tab panes={panes} />
        </div>
    );
}

function ProjectInfo({ project }: Props) {
    const pieceCount = project.pieces.reduce(
        (acc, piece) => (piece.glass ? acc + 1 : acc),
        0
    );

    const width =
        project.displayWidth || (project.width / project.ppi).toFixed(2) + 'in';
    const height =
        project.displayHeight ||
        (project.height / project.ppi).toFixed(2) + 'in';

    return (
        <div className={styles.infoPane}>
            <h2>{project.name}</h2>
            <div>{pieceCount} pieces</div>
            <div>
                {width} &times; {height}
            </div>
            <hr />
            <Table celled>
                <Table.Body>
                    {project.dateCreated && (
                        <Table.Row>
                            <Table.Cell>Date Created</Table.Cell>
                            <Table.Cell>
                                {project.dateCreated.toLocaleString()}
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {project.dateModified && (
                        <Table.Row>
                            <Table.Cell>Last Edited</Table.Cell>
                            <Table.Cell>
                                {project.dateModified.toLocaleString()}
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {project.copyright && (
                        <Table.Row>
                            <Table.Cell>Copyright</Table.Cell>
                            <Table.Cell>{project.copyright}</Table.Cell>
                        </Table.Row>
                    )}
                    {project.license && (
                        <Table.Row>
                            <Table.Cell>License</Table.Cell>
                            <Table.Cell>{project.license}</Table.Cell>
                        </Table.Row>
                    )}
                    {project.link && (
                        <Table.Row>
                            <Table.Cell>Link</Table.Cell>
                            <Table.Cell>
                                <a href={project.link}>{project.link}</a>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
    );
}

function Edit({ project, projectMethods }: Props) {
    const [name, setName] = useState(project.name);
    const [copyright, setCopyright] = useState(project.copyright);
    const [license, setLicense] = useState(project.license);
    const [link, setLink] = useState(project.link);
    const { width, height, units, sizeForm } = useSizeForm(
        project.displayWidth || project.width / project.ppi + 'in',
        project.displayHeight || project.height / project.ppi + 'in'
    );

    const save = useCallback(() => {
        const updated: Project = {
            ...project,
            name,
            copyright: copyright || undefined,
            license: license || undefined,
            link: link || undefined,
            displayWidth: width + units,
            displayHeight: height + units,
        };
        projectMethods.saveProject(updated);
    }, [
        project,
        name,
        copyright,
        license,
        link,
        width,
        height,
        units,
        projectMethods,
    ]);

    return (
        <Form className={styles.infoPane} onSubmit={save}>
            <Form.Field>
                <Form.Input
                    label="Project Name"
                    fluid
                    size="large"
                    value={name}
                    onChange={(event, data) => setName(data.value)}
                />
            </Form.Field>
            <Form.Field>
                <label>Size</label>
                {sizeForm}
            </Form.Field>
            <Form.Field>
                <Form.Input
                    label="Copyright"
                    placeholder="&copy; Your Name"
                    value={copyright}
                    onChange={(event, data) => setCopyright(data.value)}
                />
            </Form.Field>
            <Form.Field>
                <Form.Input
                    label="License"
                    placeholder="All Rights Reserved"
                    value={license}
                    onChange={(event, data) => setLicense(data.value)}
                />
            </Form.Field>
            <Form.Field>
                <Form.Input
                    label="Link"
                    placeholder="http://example.com"
                    value={link}
                    onChange={(event, data) => setLink(data.value)}
                />
            </Form.Field>
            <Form.Field>
                <Form.Button fluid onClick={save}>
                    Save Changes
                </Form.Button>
            </Form.Field>
        </Form>
    );
}
