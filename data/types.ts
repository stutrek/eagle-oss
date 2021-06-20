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
    color: string;
    nightColor: string | undefined;
    title: string;
}

export interface Piece {
    id: string;
    d: string;
    glass: string | undefined;
    bounds: Bounds;
    label: string;
    labelCenter: Point;
    labelSize: number;
    note: string;
    title: string;
    area: number;
    warnings: Warnings;
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
}
