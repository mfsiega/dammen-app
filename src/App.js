import { useState } from "react";
import "./App.css";

import { BLACK_TO_PLAY, RED_TO_PLAY } from "./common/constants";
import { Board } from "./components/Board";
import { GameEngine } from "./components/gameEngine";
import { getInitialBoard } from "./common/helpers";
import { getNextMoves } from "./components/computerOpponent";

/**
 * Core app component. Renders the board, and hooks it up to the game engine.
 * @returns template to render.
 */
function App() {
  // Game state.
  const [squares, setSquares] = useState(getInitialBoard);
  const [gamePhase, setGamePhase] = useState(() => {
    return BLACK_TO_PLAY;
  });
  const [chosenPiece, setChosenPiece] = useState(null);

  // The engine has the current state of the game.
  const engine = new GameEngine(gamePhase, squares, chosenPiece);

  function onPlay(index) {
    var newSquares, newPhase, newChosenPiece;
    if (engine.isLegalMove(index)) {
      engine.executeMove(index);
      [newSquares, newPhase, newChosenPiece] = engine.getGameState();
      console.log(newPhase);
      setSquares(newSquares);
      setGamePhase(newPhase);
      setChosenPiece(newChosenPiece);
    }
    if (newPhase === RED_TO_PLAY) {
      const nextMoves = getNextMoves(newSquares);
      engine.executeMove(nextMoves[0]);
      engine.executeMove(nextMoves[1]);
      [newSquares, newPhase, newChosenPiece] = engine.getGameState();
      console.log(newPhase);
      setSquares(newSquares);
      setGamePhase(newPhase);
      setChosenPiece(newChosenPiece);
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
