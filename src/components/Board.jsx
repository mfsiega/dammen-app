import {
  BLACK_PIECE,
  RED_PIECE,
  BLACK_PIECE_HIGHLIGHTED,
  RED_PIECE_HIGHLIGHTED,
} from "../common/constants";

const getClassName = (row, column, value) => {
  const isLight = (row + column) % 2 === 0;
  const isHighlighted =
    value === BLACK_PIECE_HIGHLIGHTED || value === RED_PIECE_HIGHLIGHTED;
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

export function Board({ squares, onPlay }) {
  return (
    <>
      <div className="board">
        {squares.map((_, index) => (
          <Square
            key={index}
            row={Math.floor(index / 8)}
            column={index % 8}
            value={squares[index]}
            onSquareClick={() => onPlay(index)}
          />
        ))}
      </div>
    </>
  );
}
