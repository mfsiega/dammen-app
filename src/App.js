import { useState } from 'react';
import './App.css';

const BLACK_PIECE = 'BLACK_PIECE';
const BLACK_PIECE_HIGHLIGHTED = 'BLACK_PIECE_HIGHLIGHTED';
const RED_PIECE = 'RED_PIECE';
const RED_PIECE_HIGHLIGHTED = 'RED_PIECE_HIGHLIGHTED';
const BLACK_TO_PLAY = 'BLACK_TO_PLAY';
const BLACK_CHOSE_PIECE = 'BLACK_CHOSE_PIECE';
const RED_TO_PLAY = 'RED_TO_PLAY';
const RED_CHOSE_PIECE = 'RED_CHOSE_PIECE';

const getClassName = (row, column, value) => {
  const isLight = (row + column) % 2 === 0;
  const isHighlighted = value === BLACK_PIECE_HIGHLIGHTED || value == RED_PIECE_HIGHLIGHTED;
  const hasBlackPiece = value === BLACK_PIECE || value === BLACK_PIECE_HIGHLIGHTED;
  const hasRedPiece = value === RED_PIECE || value === RED_PIECE_HIGHLIGHTED;
  let squareColor = '';
  if (isLight) {
    squareColor = 'light';
  } else if (isHighlighted) {
    squareColor = 'darkhighlighted';
  } else {
    squareColor = 'dark';
  }
  let piece = '';
  if (hasBlackPiece) {
    piece = 'withblackpiece';
  }
  if (hasRedPiece) {
    piece = 'withredpiece';
  }
  const c = `square ${squareColor} ${piece}`;
  return c;
}

function Square({ row, column, value, onSquareClick }) {
  return (
    <button className={getClassName(row, column, value)} onClick={onSquareClick}></button>
  )
}

function Board({gamePhase, squares, onPlay}) {
  console.log(squares);
  return (
    <>
      <div className="board">

        {squares.map((_, index) => (
          <Square key={index} row={Math.floor(index/8)} column={index%8} value={squares[index]} onSquareClick={() => onPlay(gamePhase, squares, index)}/>
      ))}
      </div>
    </>
  )
}

function App() {
  // Initialization.
  const [squares, setSquares] = useState(() => {
    const newSquares = Array(8*8).fill(null);
    newSquares.forEach((_, index, theSquares) => {
      const row = Math.floor(index/8);
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
    return newSquares
  });

  const [gamePhase, setGamePhase] = useState(() => {
    return BLACK_TO_PLAY;
  });

  const [chosenPiece, setChosenPiece] = useState(null);

  function toIndex(row, column) {
    return row*8 + column;
  }

  function squareIsOccupied(index) {
    return squares[index] != null;
  }

  function isSimpleMove(index) {
    const chosenPieceRow = Math.floor(chosenPiece / 8);
    const chosenPieceColumn = chosenPiece % 8;
    const targetRow = Math.floor(index / 8);
    const targetColumn = index % 8;

    return (
      targetRow === chosenPieceRow - 1 
      && (targetColumn === chosenPieceColumn + 1 || targetColumn == chosenPieceColumn - 1)
    );
  }

  function isSingleCapture(index) {
    const chosenPieceRow = Math.floor(chosenPiece / 8);
    const chosenPieceColumn = chosenPiece % 8;
    const targetRow = Math.floor(index / 8);
    const targetColumn = index % 8;

    const correctTargetRow = targetRow === chosenPieceRow - 2;
    if (!correctTargetRow) {
      return false;
    }
    const isUpAndLeft = targetColumn < chosenPieceColumn;
    let pieceToCapture, correctTargetColumn;
    if (isUpAndLeft) {
      pieceToCapture = squares[toIndex(chosenPieceRow - 1, chosenPieceColumn - 1)];
      correctTargetColumn = targetColumn === chosenPieceColumn - 2;
    } else {
      pieceToCapture = squares[toIndex(chosenPieceRow - 1, chosenPieceColumn + 1)];
      correctTargetColumn = targetColumn === chosenPieceColumn + 2;
    }
    return pieceToCapture && correctTargetColumn; // and we already know correctTargetRow is true.
  }

  // Get the index of the piece we should remove for a capture by chosenPiece to index.
  function getCapturedIndexForMoveTo(index) {
    const chosenPieceRow = Math.floor(chosenPiece / 8);
    const chosenPieceColumn = chosenPiece % 8;
    const targetRow = Math.floor(index / 8);
    const targetColumn = index % 8;
    const isUpAndLeft = targetColumn < chosenPieceColumn;
    const rowToRemove = chosenPieceRow - 1;
    if (isUpAndLeft) {
      const columnToRemove = chosenPieceColumn - 1;
      return rowToRemove*8 + columnToRemove;
    } else {
      const columnToRemove = chosenPieceColumn + 1;
      return rowToRemove*8 + columnToRemove;
    }
  }

  function chosenPieceCanMoveTo(index) {
    // TODO: this is all only for the bottom player.
    if (squareIsOccupied(index)) {
      return false;
    }
    if (isSimpleMove(index)) { // normal hop to an adjacent square
      return true;
    }
    if (isSingleCapture(index)) { // single capture
      return true;
    }
    return false;
  }

  function executeMove(index) {
    const nextSquares = squares.slice();
    // Remove the piece from its current square.
    nextSquares[chosenPiece] = null;
    // Put the piece on the target square.
    nextSquares[index] = BLACK_PIECE;
    // If it's a capture, remove the one in between.
    if (isSingleCapture(index)) {
      nextSquares[getCapturedIndexForMoveTo(index)] = null;
    }
    console.log(chosenPiece);
    console.log(index);
    setSquares(nextSquares);
    setGamePhase(RED_TO_PLAY); // TODO, obviously.
  }

  // Callback for when a square is clicked.
  function onPlay(gamePhase, squares, index) {
    console.log(`Running onPlay! phase=${gamePhase}, index=${index}`);
    if (gamePhase === BLACK_TO_PLAY) {
      if (squares[index] === BLACK_PIECE){
        const nextSquares = squares.slice();
        nextSquares[index] = BLACK_PIECE_HIGHLIGHTED;
        setSquares(nextSquares);
        setGamePhase(BLACK_CHOSE_PIECE);
        setChosenPiece(index)
      }
    }
    else if (gamePhase === BLACK_CHOSE_PIECE) {
      if (index === chosenPiece) {
        const nextSquares = squares.slice();
        nextSquares[index] = BLACK_PIECE;
        setSquares(nextSquares);
        setGamePhase(BLACK_TO_PLAY);
        setChosenPiece(null);
      } else {
        if (chosenPieceCanMoveTo(index)) {
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
        <Board gamePhase={gamePhase} squares={squares} onPlay={onPlay}/>
      </header>
    </div>
  );
}

export default App;
