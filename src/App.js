import { useState } from "react";
import "./App.css";

import {
  BLACK_PIECE_HIGHLIGHTED,
  RED_PIECE_HIGHLIGHTED,
  BLACK_PIECE,
  RED_PIECE,
  BLACK_TO_PLAY,
  RED_TO_PLAY,
  BLACK_CHOSE_PIECE,
  RED_CHOSE_PIECE,
} from "./common/constants";
import { MoveValidator } from "./components/moveValidator";

const getClassName = (row, column, value) => {
  const isLight = (row + column) % 2 === 0;
  const isHighlighted =
    value === BLACK_PIECE_HIGHLIGHTED || value == RED_PIECE_HIGHLIGHTED;
  const hasBlackPiece =
    value === BLACK_PIECE || value === BLACK_PIECE_HIGHLIGHTED;
  const hasRedPiece = value === RED_PIECE || value === RED_PIECE_HIGHLIGHTED;
  let squareColor = "";
  if (isLight) {
    squareColor = "light";
  } else if (isHighlighted) {
    squareColor = "darkhighlighted";
  } else {
    squareColor = "dark";
  }
  let piece = "";
  if (hasBlackPiece) {
    piece = "withblackpiece";
  }
  if (hasRedPiece) {
    piece = "withredpiece";
  }
  const c = `square ${squareColor} ${piece}`;
  return c;
};

function Square({ row, column, value, onSquareClick }) {
  return (
    <button
      className={getClassName(row, column, value)}
      onClick={onSquareClick}
    ></button>
  );
}

function Board({ gamePhase, squares, onPlay }) {
  console.log(squares);
  return (
    <>
      <div className="board">
        {squares.map((_, index) => (
          <Square
            key={index}
            row={Math.floor(index / 8)}
            column={index % 8}
            value={squares[index]}
            onSquareClick={() => onPlay(gamePhase, squares, index)}
          />
        ))}
      </div>
    </>
  );
}

function App() {
  // Initialization.
  const [squares, setSquares] = useState(() => {
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
  });

  const [gamePhase, setGamePhase] = useState(() => {
    return BLACK_TO_PLAY;
  });

  const [chosenPiece, setChosenPiece] = useState(null);

  // Get the index of the piece we should remove for a capture by chosenPiece to index.
  function getCapturedIndexForMoveToPlayerOne(index) {
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
  function getCapturedIndexForMoveToPlayerTwo(index) {
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

  function executeMove(index) {
    const validator = new MoveValidator(chosenPiece, gamePhase, squares);
    const nextSquares = squares.slice();
    // Remove the piece from its current square.
    nextSquares[chosenPiece] = null;
    // Put the piece on the target square.
    if (gamePhase === BLACK_CHOSE_PIECE) {
      nextSquares[index] = BLACK_PIECE;
      if (validator.isSingleCapturePlayerOne(index)) {
        nextSquares[getCapturedIndexForMoveToPlayerOne(index)] = null;
      }
      setGamePhase(RED_TO_PLAY);
    } else {
      nextSquares[index] = RED_PIECE;
      if (validator.isSingleCapturePlayerTwo(index)) {
        nextSquares[getCapturedIndexForMoveToPlayerTwo(index)] = null;
      }
      setGamePhase(BLACK_TO_PLAY);
    }
    setSquares(nextSquares);
  }

  // Callback for when a square is clicked.
  function onPlay(gamePhase, squares, index) {
    console.log(`Running onPlay! phase=${gamePhase}, index=${index}`);
    if (gamePhase === BLACK_TO_PLAY) {
      if (squares[index] === BLACK_PIECE) {
        const nextSquares = squares.slice();
        nextSquares[index] = BLACK_PIECE_HIGHLIGHTED;
        setSquares(nextSquares);
        setGamePhase(BLACK_CHOSE_PIECE);
        setChosenPiece(index);
      }
    } else if (gamePhase === BLACK_CHOSE_PIECE) {
      const validator = new MoveValidator(chosenPiece, gamePhase, squares);
      if (index === chosenPiece) {
        const nextSquares = squares.slice();
        nextSquares[index] = BLACK_PIECE;
        setSquares(nextSquares);
        setGamePhase(BLACK_TO_PLAY);
        setChosenPiece(null);
      } else {
        if (validator.chosenPieceCanMoveTo(index)) {
          executeMove(index);
        } else {
          console.log("invalid!");
        }
      }
    } else if (gamePhase === RED_TO_PLAY) {
      if (squares[index] === RED_PIECE) {
        const nextSquares = squares.slice();
        nextSquares[index] = RED_PIECE_HIGHLIGHTED;
        setSquares(nextSquares);
        setGamePhase(RED_CHOSE_PIECE);
        setChosenPiece(index);
      }
    } else if (gamePhase === RED_CHOSE_PIECE) {
      const validator = new MoveValidator(chosenPiece, gamePhase, squares);
      if (index === chosenPiece) {
        // Unselect the piece.
        const nextSquares = squares.slice();
        nextSquares[index] = RED_PIECE;
        setSquares(nextSquares);
        setGamePhase(RED_TO_PLAY);
        setChosenPiece(null);
      } else {
        // Move the piece, if allowed.
        if (validator.chosenPieceCanMoveTo(index)) {
          executeMove(index);
        } else {
          console.log("invalid!");
        }
      }
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>Dammen!</p>
        <Board gamePhase={gamePhase} squares={squares} onPlay={onPlay} />
      </header>
    </div>
  );
}

export default App;
