import { expose, Transfer } from 'threads/worker';
import type { TransferDescriptor } from 'threads';

import paper from 'paper';

paper.setup(new paper.Size(1000, 1000));

import potrace from './potrace';

async function traceImageBitmap(
    imageBitmap: ImageBitmap,
    params: potrace.Parameters
) {
    potrace.clear();
    potrace.setParameter(params);

    potrace.loadImageBitmap(imageBitmap);

    return new Promise<string[]>((resolve) => {
        potrace.process(() => {
            const pathlist = potrace.getPathlist();
            const totalArea = imageBitmap.width * imageBitmap.height;
            // if the first piece takes up 90% of the area, it's a sun catcher
            // and that piece is the outline on the paper
            const maxArea = totalArea / 90;

            const shapes: paper.CompoundPath[] = [];
            for (const path of pathlist) {
                let firstPoint = path.curve.c[path.curve.c.length - 1];
                let parentPath = shapes.find((p) =>
                    p.contains(new paper.Point(firstPoint.x, firstPoint.y))
                );
                const compoundPath = new paper.CompoundPath(
                    potrace.pathToString(path.curve, 1)
                );
                if (parentPath) {
                    parentPath.addChild(compoundPath);
                    // parentPath.importSVG(`<path d="${path}" />`);
                } else {
                    // without reversing the points, the area is negative.
                    compoundPath.reverse();
                    if (compoundPath.area < maxArea) {
                        shapes.push(compoundPath);
                    }
                }
            }

            resolve(shapes.map((shape) => shape.pathData));
        });
    });
}
const toExpose = {
    traceImageBitmap,
} as const;

expose(toExpose);

export type PotraceWorker = typeof toExpose;
