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

/**
 * The core game engine. It offers three main functions:
 * - isLegalMove, to indicate whether it's possible to move to a given square (based on the current game state).
 * - executeMove, which carries out that move assuming that it's possible.
 * - getGameState which returns the latest state of the game.
 */
export class GameEngine {
  constructor(gamePhase, squares, chosenPiece) {
    this.gamePhase = gamePhase;
    this.squares = squares;
    this.chosenPiece = chosenPiece;
    this.moveValidator = new MoveValidator(chosenPiece, gamePhase, squares);
  }

  /**
   * Indicates whether the given move is possible. The semantics depend on the current game state:
   * - If it's a TO_PLAY state, then this means the player is trying to select a piece, and we allow it if there's a piece on the square.
   * - If it's a CHOSE_PIECE state, then this means the player is trying to move their chosen piece to that square.
   *
   * TODO:
   * - Only allow selecting a piece if it will actually be able to move.
   * @param {int} index the index of the square we're trying to move to
   * @returns whether the move is legal
   */
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

  /**
   * Carries out the move for the given index. See isLegalMove above for extra context.
   * Updates the game state.
   * @param {int} index
   */
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
    this.moveValidator = new MoveValidator(
      this.chosenPiece,
      this.gamePhase,
      this.squares,
    );
  }

  /**
   * Get the current game state
   * @returns list containing the squares, game phase, and the chosen piece if there is one
   */
  getGameState() {
    return [this.squares, this.gamePhase, this.chosenPiece];
  }

  // Helper function.
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

  // Helper function.
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
}
