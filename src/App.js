import { useState } from "react";
import "./App.css";

import { BLACK_TO_PLAY } from "./common/constants";
import { Board } from "./components/Board";
import { GameEngine } from "./components/gameEngine";
import { getInitialBoard } from "./common/helpers";

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
    if (engine.isLegalMove(index)) {
      engine.executeMove(index);
      var newSquares, newPhase, newChosenPiece;
      [newSquares, newPhase, newChosenPiece] = engine.getGameState();
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
