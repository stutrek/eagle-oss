import Dexie from 'dexie';
import { Project } from '../types';

let db: EagleDatabase;

class EagleDatabase extends Dexie {
    projects: Dexie.Table<Project, string>;

    constructor(dbName: string) {
        super(dbName);

        this.version(2).stores({
            projects: 'id, name, owner',
            users: 'id, firstName, lastName, email',
        });

        this.version(3).stores({
            projects: 'id, name, owner, dateCreated, dateModified',
            users: 'id, firstName, lastName, email',
        });

        this.projects = this.table('projects');
    }
}

export const getDb = () => {
    if (db === undefined) {
        db = new EagleDatabase('eagle');
    }
    return db;
};
