import { Project } from '../../data/types';

type Props = {
    project: Project;
};
export function LicenseText({ project }: Props) {
    const { copyright, license, link } = project;

    const licenseText = [copyright, license, link].filter((a) => a).join(' ');

    if (!licenseText) {
        return null;
    }

    const licenseJsx = (
        <>
            <text
                x="20"
                y={project.height - 20}
                fontSize={12}
                className="strokeForLightPiece"
            >
                {licenseText}
            </text>
            <text
                x="20"
                y={project.height - 20}
                fontSize={12}
                className="labelForLightPiece"
            >
                {licenseText}
            </text>
        </>
    );

    if (link) {
        return <a href={link}>{licenseJsx}</a>;
    }

    return licenseJsx;
}
