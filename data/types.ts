export interface Point {
    x: number;
    y: number;
}

export interface Warnings {
    concave: boolean;
    maxPpi: number;
}

export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Glass {
    id: string;
    color: string | [number, number, number];
    nightColor?: string;
    title: string;
}

export interface Piece {
    id: string;
    d: string;
    glass: string | undefined;
    label: string;
    labelCenter: Point;
    labelSize: number;
    note?: string;
    title?: string;
    area?: number;
    warnings?: Warnings;
}

export interface Project {
    id: string;
    name: string;
    pieces: Array<Piece>;
    glasses: Array<Glass>;
    width: number;
    height: number;
    ppi: number;
    dateCreated: Date;
    dateModified: Date;
    copyright: string;
    license: string;
}

export type PreliminaryColor = {
    id: string;
    shapeCount: number;
    color: [number, number, number];
};

export type PreliminaryShape = {
    path: string;
    labelLocation: [number, number];
    labelSize: number;
    color: string;
};

export type PreliminaryProject = {
    shapes: PreliminaryShape[];
    colors: PreliminaryColor[];
    width: number;
    height: number;
    ppi: number;
};
