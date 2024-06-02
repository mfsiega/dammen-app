import { RED_PIECE, RED_CHOSE_PIECE, RED_PIECE_HIGHLIGHTED } from "../common/constants";
import { GameEngine } from "./gameEngine";

/**
 * Generates two moves:
 * - Piece selection.
 * - Destination.
 *
 * The moves will be legal.
 * The move choice is left as an implementation detail.
 * We assume that this is making moves for player 2 (RED pieces).
 * @param {int[]} squares
 */
export function getNextMoves(squares) {
  const legalMoves = [];
  for (let pieceToMove = 0; pieceToMove < 64; pieceToMove++) {
    if (squares[pieceToMove] !== RED_PIECE) {
      continue; // there's no piece here.
    }
    const nextSquares = squares.slice();
    nextSquares[pieceToMove] = RED_PIECE_HIGHLIGHTED;
    const engine = new GameEngine(RED_CHOSE_PIECE, nextSquares, pieceToMove);
    for (let target = 0; target < 64; target++) {
      if (engine.isLegalMove(target) && target !== pieceToMove) {
        legalMoves.push([pieceToMove, target]);
      }
    }
  }
  const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
  return randomMove;
}
