import { Glass, Piece } from './types';

export function labelPieces(inputPieces: Piece[], glasses: Glass[]) {
    const piecesByGlass: Record<string, Piece[]> = {};
    const piecesById: Record<string, Piece> = {};

    for (const piece of inputPieces) {
        piecesById[piece.id] = piece;
        if (piece.glass === undefined) {
            continue;
        }
        if (piecesByGlass[piece.glass] === undefined) {
            piecesByGlass[piece.glass] = [];
        }
        piecesByGlass[piece.glass].push(piece);
    }

    let count = 0;
    for (const glass of glasses) {
        piecesByGlass[glass.id] = piecesByGlass[glass.id].map((piece) => {
            const newlabel = `${++count}`;
            if (piece.label === newlabel) {
                return piece;
            }
            return (piecesById[piece.id] = {
                ...piece,
                label: newlabel,
            });
        });
    }
    const pieces = inputPieces.map((piece) => piecesById[piece.id]);
    return pieces;
}
