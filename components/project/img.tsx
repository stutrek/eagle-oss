import { useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { ColorOption, renderProject } from '../../data/projectString';
import { Project } from '../../data/types';
import { useCanceledEffect } from '../../hooks/useCanceledEffect';

type Props = {
    project: Project;
    color: ColorOption;
    showLabels: boolean;
    widthOverride?: string;
    heightOverride?: string;
};

export function ProjectImg({ project, color, showLabels }: Props) {
    const [dataUrl, setDataUrl] = useState<string | undefined>();

    useCanceledEffect(
        () => renderProject(project, color, showLabels, '5pt'),
        setDataUrl,
        [project, color, showLabels]
    );

    if (dataUrl) {
        return <img src={dataUrl} alt="" />;
    }
    return <Loader />;
}
