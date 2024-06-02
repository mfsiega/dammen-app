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