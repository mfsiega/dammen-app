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
  console.log(c);
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


  // Callback for when a square is clicked.
  function onPlay(gamePhase, squares, index) {
    console.log('Running onPlay!');
    if (gamePhase === BLACK_TO_PLAY) {
      if (squares[index] === BLACK_PIECE){
        const nextSquares = squares.slice();
        nextSquares[index] = BLACK_PIECE_HIGHLIGHTED;
        setSquares(nextSquares);
      }
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>Dammen!</p>
        <Board gamePhase={BLACK_TO_PLAY} squares={squares} onPlay={onPlay}/>
      </header>
    </div>
  );
}

export default App;
