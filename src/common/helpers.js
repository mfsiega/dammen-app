import { RED_PIECE, BLACK_PIECE } from "./constants";

// Get the index of the piece we should remove for a capture by chosenPiece to index.
export function getCapturedIndexForMovePlayerOne(chosenPiece, index) {
  const chosenPieceRow = Math.floor(chosenPiece / 8);
  const chosenPieceColumn = chosenPiece % 8;
  const targetColumn = index % 8;
  const isUpAndLeft = targetColumn < chosenPieceColumn;
  const rowToRemove = chosenPieceRow - 1;
  if (isUpAndLeft) {
    const columnToRemove = chosenPieceColumn - 1;
    return rowToRemove * 8 + columnToRemove;
  } else {
    const columnToRemove = chosenPieceColumn + 1;
    return rowToRemove * 8 + columnToRemove;
  }
}

export function getCapturedIndexForMovePlayerTwo(chosenPiece, index) {
  const chosenPieceRow = Math.floor(chosenPiece / 8);
  const chosenPieceColumn = chosenPiece % 8;
  const targetColumn = index % 8;
  const isUpAndLeft = targetColumn < chosenPieceColumn;
  const rowToRemove = chosenPieceRow + 1;
  if (isUpAndLeft) {
    const columnToRemove = chosenPieceColumn - 1;
    return rowToRemove * 8 + columnToRemove;
  } else {
    const columnToRemove = chosenPieceColumn + 1;
    return rowToRemove * 8 + columnToRemove;
  }
}

export function getInitialBoard() {
  const newSquares = Array(8 * 8).fill(null);
  newSquares.forEach((_, index, theSquares) => {
    const row = Math.floor(index / 8);
    const column = index % 8;
    const squareIsDark = (row + column) % 2 === 1;
    const hasRedPiece = row < 3 && squareIsDark;
    if (hasRedPiece) {
      theSquares[index] = RED_PIECE;
    }
    const hasBlackPiece = row > 4 && squareIsDark;
    if (hasBlackPiece) {
      theSquares[index] = BLACK_PIECE;
    }
  });
  return newSquares;
}
