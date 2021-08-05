import { Checkbox, Grid, Icon, Input } from 'semantic-ui-react';
import { Project } from '../../../data/types';
import { ProjectMethods } from '../../../hooks/useProject';

import styles from './toolbar.module.css';

type Props = {
    project: Project;
    projectMethods: ProjectMethods;
};

export function Export({ project, projectMethods }: Props) {
    return (
        <div className={styles.export}>
            <h2>Export {project.name}</h2>
            <hr />
            <h3>Size</h3>
            <label>
                inches <Checkbox toggle /> cm
            </label>
            <br />
            <label>
                width:{' '}
                <Input
                    value={(project.width / project.ppi).toFixed(2)}
                    label={{ basic: true, content: 'in' }}
                    labelPosition="right"
                />
            </label>
            <br />
            <label>
                <Icon name="chain" />
            </label>
            <br />
            <label>
                height:{' '}
                <Input
                    value={(project.height / project.ppi).toFixed(2)}
                    label={{ basic: true, content: 'in' }}
                    labelPosition="right"
                />
            </label>
            <hr />
            <h3>Download</h3>
            <div className={styles.exportOptions}>
                <div className={styles.exportOption}>Color</div>
                <div className={styles.exportOption}>Outlines</div>
                <div className={styles.exportOption}>Grayscale</div>
            </div>
        </div>
    );
}
