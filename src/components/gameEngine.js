function executeMove(index) {
  const validator = new MoveValidator(chosenPiece, gamePhase, squares);
  const nextSquares = squares.slice();
  // Remove the piece from its current square.
  nextSquares[chosenPiece] = null;
  // Put the piece on the target square.
  if (gamePhase === BLACK_CHOSE_PIECE) {
    nextSquares[index] = BLACK_PIECE;
    if (validator.isSingleCapturePlayerOne(index)) {
      nextSquares[getCapturedIndexForMovePlayerOne(chosenPiece, index)] = null;
    }
    setGamePhase(RED_TO_PLAY);
  } else {
    nextSquares[index] = RED_PIECE;
    if (validator.isSingleCapturePlayerTwo(index)) {
      nextSquares[getCapturedIndexForMovePlayerTwo(chosenPiece, index)] = null;
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
