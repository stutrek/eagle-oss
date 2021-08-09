import { useLiveQuery } from 'dexie-react-hooks';
import { getDb } from '../data/db';
import { Project } from '../data/types';

export const useAllProjects = (
    sort: keyof Project = 'dateCreated',
    direction: 'desc' | 'asc' = 'asc'
) => {
    return useLiveQuery(
        async () => {
            const db = getDb();

            const collection = db.projects.orderBy(sort);
            if (direction === 'desc') {
                collection.reverse();
            }
            const projects = await collection.toArray();

            return [false, projects] as const;
        },
        [],
        [true, [] as Project[]] as const
    );
};
