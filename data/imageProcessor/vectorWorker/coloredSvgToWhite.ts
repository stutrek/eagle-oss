import { Project, Color } from 'paper';

export function coloredSVGToWhite(jsonString: string, size: [number, number]) {
    const canvas = new OffscreenCanvas(size[0], size[1]);
    let project = new Project(canvas as unknown as HTMLCanvasElement);
    project.importJSON(jsonString);

    // if it has no alpha the shapes behind it are likely important
    // if it's black it might be some sort of a traced outline.
    let coloredItems = project.getItems({
        recursive: true,
        match: (item: paper.CompoundPath) => {
            const color = item.fillColor;
            // if there is no fill this is an outline or something else
            // this algorithm doesn't care about.
            if (item.hasFill() === false || !color || color.alpha === 0) {
                return false;
            }

            // if it has no area we don't care about it.
            if (!item.area) {
                return false;
            }

            // this tries to catch outlined strokes.
            if (
                color.brightness === 0 &&
                Math.abs(item.area) < item.bounds.area / 10
            ) {
                return false;
            }

            return true;
        },
    });

    const whiteColor = new Color(1, 1, 1);
    coloredItems.forEach((item) => (item.fillColor = whiteColor));

    const returnString = project.exportJSON();

    project.clear();

    return Promise.resolve(returnString);
}
