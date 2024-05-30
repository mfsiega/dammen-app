import './App.css';
import Checkerboard from './components/Checkerboard'
import { BlackPiece } from './components/Piece';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Dammen!</p>
        <Checkerboard/>
        <BlackPiece/>
      </header>
    </div>
  );
}

export default App;
