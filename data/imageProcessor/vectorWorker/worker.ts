import { expose } from 'threads/worker';

import { coloredSVGToWhite } from './coloredSvgToWhite';
import { createPreliminaryProject } from './createPreliminaryProject';

const toExpose = {
    coloredSVGToWhite,
    createPreliminaryProject,
} as const;

expose(toExpose);

export type PaperWorkerType = typeof toExpose;
