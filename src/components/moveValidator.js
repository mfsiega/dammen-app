import { BLACK_CHOSE_PIECE } from "../common/constants";

export class MoveValidator {
  constructor(chosenPiece, gamePhase, squares) {
    this.chosenPiece = chosenPiece;
    this.chosenRow = Math.floor(chosenPiece / 8);
    this.chosenColumn = chosenPiece % 8;
    this.gamePhase = gamePhase;
    this.squares = squares;
  }

  squareIsOccupied(index) {
    return this.squares[index] != null;
  }

  // NOTE: I'm *pretty* sure it's possible to handle the directionality
  // more cleanly, and I want to come back and fix it up, but this should
  // work for now.
  chosenPieceCanMoveTo(index) {
    if (this.squareIsOccupied(index)) {
      return false; // We can never move to an occupied square!
    }
    console.log(this.gamePhase);
    if (this.gamePhase === BLACK_CHOSE_PIECE) {
      if (this.isSimpleMovePlayerOne(index)) {
        // normal hop to an adjacent square
        return true;
      }
      if (this.isSingleCapturePlayerOne(index)) {
        // single capture
        return true;
      }
      return false;
    } else {
      if (this.isSimpleMovePlayerTwo(index)) {
        // normal hop to an adjacent square
        return true;
      }
      if (this.isSingleCapturePlayerTwo(index)) {
        // single capture
        return true;
      }
      return false;
    }
  }

  isSimpleMovePlayerOne(index) {
    const chosenPieceRow = Math.floor(this.chosenPiece / 8);
    const chosenPieceColumn = this.chosenPiece % 8;
    const targetRow = Math.floor(index / 8);
    const targetColumn = index % 8;

    return (
      targetRow === chosenPieceRow - 1 &&
      (targetColumn === chosenPieceColumn + 1 ||
        targetColumn === chosenPieceColumn - 1)
    );
  }

  isSingleCapturePlayerOne(index) {
    const chosenPieceRow = Math.floor(this.chosenPiece / 8);
    const chosenPieceColumn = this.chosenPiece % 8;
    const targetRow = Math.floor(index / 8);
    const targetColumn = index % 8;

    const correctTargetRow = targetRow === chosenPieceRow - 2;
    if (!correctTargetRow) {
      return false;
    }
    const isUpAndLeft = targetColumn < chosenPieceColumn;
    let hasPieceToCapture, correctTargetColumn;
    if (isUpAndLeft) {
      hasPieceToCapture =
        this.squares[this.toIndex(chosenPieceRow - 1, chosenPieceColumn - 1)];
      correctTargetColumn = targetColumn === chosenPieceColumn - 2;
    } else {
      hasPieceToCapture =
        this.squares[this.toIndex(chosenPieceRow - 1, chosenPieceColumn + 1)];
      correctTargetColumn = targetColumn === chosenPieceColumn + 2;
    }
    return hasPieceToCapture && correctTargetColumn; // and we already know correctTargetRow is true.
  }

  isSimpleMovePlayerTwo(index) {
    const chosenPieceRow = Math.floor(this.chosenPiece / 8);
    const chosenPieceColumn = this.chosenPiece % 8;
    const targetRow = Math.floor(index / 8);
    const targetColumn = index % 8;

    return (
      targetRow === chosenPieceRow + 1 &&
      (targetColumn === chosenPieceColumn + 1 ||
        targetColumn === chosenPieceColumn - 1)
    );
  }

  isSingleCapturePlayerTwo(index) {
    const chosenPieceRow = Math.floor(this.chosenPiece / 8);
    const chosenPieceColumn = this.chosenPiece % 8;
    const targetRow = Math.floor(index / 8);
    const targetColumn = index % 8;
    console.log(
      `${chosenPieceRow} ${chosenPieceColumn} ${targetRow} ${targetColumn}`,
    );
    const correctTargetRow = targetRow === chosenPieceRow + 2;
    if (!correctTargetRow) {
      return false;
    }
    const isLeft = targetColumn < chosenPieceColumn;
    let hasPieceToCapture, correctTargetColumn;
    if (isLeft) {
      hasPieceToCapture =
        this.squares[this.toIndex(chosenPieceRow + 1, chosenPieceColumn - 1)];
      correctTargetColumn = targetColumn === chosenPieceColumn - 2;
    } else {
      hasPieceToCapture =
        this.squares[this.toIndex(chosenPieceRow + 1, chosenPieceColumn + 1)];
      correctTargetColumn = targetColumn === chosenPieceColumn + 2;
    }
    console.log(hasPieceToCapture && correctTargetColumn);
    return hasPieceToCapture && correctTargetColumn; // and we already know correctTargetRow is true.
  }

  toIndex(row, column) {
    return row * 8 + column;
  }
}
