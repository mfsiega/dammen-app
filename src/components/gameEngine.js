import { MoveValidator } from "./moveValidator";
import {
  getCapturedIndexForMovePlayerOne,
  getCapturedIndexForMovePlayerTwo,
} from "../common/helpers";
import {
  BLACK_PIECE,
  RED_PIECE,
  BLACK_CHOSE_PIECE,
  RED_CHOSE_PIECE,
  BLACK_TO_PLAY,
  RED_TO_PLAY,
  BLACK_PIECE_HIGHLIGHTED,
  RED_PIECE_HIGHLIGHTED,
} from "../common/constants";

export class GameEngine {
  constructor(gamePhase, squares, chosenPiece) {
    this.gamePhase = gamePhase;
    this.squares = squares;
    this.chosenPiece = chosenPiece;
    this.moveValidator = new MoveValidator(chosenPiece, gamePhase, squares);
  }

  captureIsAvailablePlayerOne() {
    for (let pieceToMove = 0; pieceToMove < 64; pieceToMove++) {
      if (
        this.squares[pieceToMove] !== BLACK_PIECE &&
        this.squares[pieceToMove] !== BLACK_PIECE_HIGHLIGHTED
      ) {
        continue;
      }
      // There's a piece here, so let's check if it can capture!
      const validator = new MoveValidator(
        pieceToMove,
        BLACK_CHOSE_PIECE,
        this.squares,
      );
      for (let target = 0; target < 64; target++) {
        if (!validator.chosenPieceCanMoveTo(target)) {
          continue;
        }
        if (validator.isSingleCapturePlayerOne(target)) {
          return true;
        }
      }
    }
    return false;
  }

  captureIsAvailablePlayerTwo() {
    for (let pieceToMove = 0; pieceToMove < 64; pieceToMove++) {
      if (
        this.squares[pieceToMove] !== RED_PIECE &&
        this.squares[pieceToMove] !== RED_PIECE_HIGHLIGHTED
      ) {
        continue;
      }
      // There's a piece here, so let's check if it can capture.
      const validator = new MoveValidator(
        pieceToMove,
        RED_CHOSE_PIECE,
        this.squares,
      );
      for (let target = 0; target < 64; target++) {
        if (!validator.chosenPieceCanMoveTo(target)) {
          continue;
        }
        if (validator.isSingleCapturePlayerTwo(target)) {
          return true;
        }
      }
    }
    return false;
  }

  isLegalMove(index) {
    switch (this.gamePhase) {
      case BLACK_TO_PLAY: {
        return this.squares[index] === BLACK_PIECE;
      }
      case BLACK_CHOSE_PIECE: {
        if (index === this.chosenPiece) {
          return true; // deselect the current piece.
        }
        return this.captureIsAvailablePlayerOne()
          ? this.moveValidator.chosenPieceCanMoveTo(index) &&
              this.moveValidator.isSingleCapturePlayerOne(index)
          : this.moveValidator.chosenPieceCanMoveTo(index);
      }
      case RED_TO_PLAY: {
        return this.squares[index] === RED_PIECE;
      }
      case RED_CHOSE_PIECE: {
        if (index === this.chosenPiece) {
          return true; // deselect the current piece.
        }
        return this.captureIsAvailablePlayerTwo()
          ? this.moveValidator.chosenPieceCanMoveTo(index) &&
              this.moveValidator.isSingleCapturePlayerTwo(index)
          : this.moveValidator.chosenPieceCanMoveTo(index);
      }
      default:
        throw new Error(`Unexpected game phase: ${this.gamePhase}`);
    }
  }

  // Note: we assume that the move has already been validated via isLegalMove.
  executeMove(index) {
    switch (this.gamePhase) {
      case BLACK_TO_PLAY: {
        this.squares[index] = BLACK_PIECE_HIGHLIGHTED;
        this.chosenPiece = index;
        this.gamePhase = BLACK_CHOSE_PIECE;
        break;
      }
      case RED_TO_PLAY: {
        this.squares[index] = RED_PIECE_HIGHLIGHTED;
        this.chosenPiece = index;
        this.gamePhase = RED_CHOSE_PIECE;
        break;
      }
      case BLACK_CHOSE_PIECE: {
        if (index === this.chosenPiece) {
          this.squares[this.chosenPiece] = BLACK_PIECE;
          this.gamePhase = BLACK_TO_PLAY;
          this.chosenPiece = null;
        } else {
          this.squares[this.chosenPiece] = null;
          this.squares[index] = BLACK_PIECE;
          if (this.moveValidator.isSingleCapturePlayerOne(index)) {
            const pieceToRemove = getCapturedIndexForMovePlayerOne(
              this.chosenPiece,
              index,
            );
            this.squares[pieceToRemove] = null;
          }
          this.gamePhase = RED_TO_PLAY;
          this.chosenPiece = null;
        }
        break;
      }
      case RED_CHOSE_PIECE: {
        if (index === this.chosenPiece) {
          this.squares[this.chosenPiece] = RED_PIECE;
          this.gamePhase = RED_TO_PLAY;
          this.chosenPiece = null;
        } else {
          this.squares[this.chosenPiece] = null;
          this.squares[index] = RED_PIECE;
          if (this.moveValidator.isSingleCapturePlayerTwo(index)) {
            const pieceToRemove = getCapturedIndexForMovePlayerTwo(
              this.chosenPiece,
              index,
            );
            console.log(pieceToRemove);
            this.squares[pieceToRemove] = null;
          }
          this.gamePhase = BLACK_TO_PLAY;
          this.chosenPiece = null;
        }
        break;
      }
      default:
        throw new Error(`Unexpected game phase: ${this.gamePhase}`);
    }
  }

  getGameState() {
    return [this.squares, this.gamePhase, this.chosenPiece];
  }
}
