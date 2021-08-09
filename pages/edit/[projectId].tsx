import React from 'react';
import { useRouter } from 'next/router';

import { Editor } from '../../components/editPage/layout';

const EditorPage = () => {
    const router = useRouter();
    let { projectId } = router.query;

    if (Array.isArray(projectId)) {
        projectId = projectId[0];
    }

    if (projectId === undefined) {
        return <div>no project</div>;
    }
    return <Editor projectId={projectId} />;
};

export default EditorPage;
