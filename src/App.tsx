import { useState, useMemo, useEffect, useCallback } from 'react';
import { DartsGame, Player } from './game';
import Dartboard from './components/Dartboard';
import SettingsIcon from './components/SettingsIcon';
import SettingsModal from './components/SettingsModal';
import './App.css';

function App() {
  const [startingScore, setStartingScore] = useState(501);
  // useMemo to instantiate the game only once
  const game = useMemo(() => new DartsGame(startingScore), [startingScore]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [winner, setWinner] = useState<Player | undefined>(undefined);
  const [dartInputs, setDartInputs] = useState(['', '', '']);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const updateGameState = useCallback(() => {
    setPlayers([...game.players]);
    setCurrentPlayerIndex(game.currentPlayerIndex);
    setWinner(game.getWinner());
  }, [game]);

  // Initialize game
  useEffect(() => {
    game.addPlayer('Player 1');
    game.addPlayer('Player 2');
    updateGameState();
  }, [game, updateGameState]);

  const parseScore = (input: string): number => {
    const value = input.trim().toUpperCase();
    if (!value) return 0;
    if (value === 'BULL' || value === '50') return 50;
    if (value === 'OB' || value === '25') return 25;
    let multiplier = 1;
    let scorePart = value;
    if (value.startsWith('T')) {
      multiplier = 3;
      scorePart = value.substring(1);
    } else if (value.startsWith('D')) {
      multiplier = 2;
      scorePart = value.substring(1);
    }
    const baseScore = parseInt(scorePart, 10);
    if (isNaN(baseScore) || baseScore < 1 || baseScore > 20) {
      console.warn(`Invalid score input: ${input}`);
      return 0;
    }
    return baseScore * multiplier;
  };

  const handleResetGame = useCallback(() => {
    game.reset();
    updateGameState();
    setDartInputs(['', '', '']);
  }, [game, updateGameState]);

  const handleNewGame = useCallback((newScore: number) => {
    setStartingScore(newScore);
    setDartInputs(['', '', '']);
  }, []);

  const handleSubmitTurn = () => {
    if (winner || dartInputs.every(input => input.trim() === '')) {
      return;
    }

    const scores = dartInputs.map(parseScore);
    game.recordTurn(scores);
    updateGameState();
    setDartInputs(['', '', '']);

    if (game.getWinner()) {
      alert(`${game.getWinner()?.name} wins the game!`);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...dartInputs];
    newInputs[index] = value;
    setDartInputs(newInputs);
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div id="app">
      <header className="app-header">
        <h1>Darts Scorer</h1>
        <button className="settings-button" onClick={() => setSettingsOpen(true)}>
          <SettingsIcon />
        </button>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onNewGame={handleNewGame}
        onReset={handleResetGame}
        currentScore={startingScore}
      />

      <div className="scoreboard-container">
        {players.map((p, index) => (
          <div key={p.name} className={`player-score ${index === currentPlayerIndex ? 'active' : ''}`}>
            <h4>{p.name}</h4>
            <p>{p.score}</p>
          </div>
        ))}
      </div>

      <main className="game-area">
        <Dartboard scoresToHighlight={dartInputs} />
        <div className="controls">
          <h3>{currentPlayer ? `${currentPlayer.name}'s Turn` : 'Game Over'}</h3>
          <div className="score-inputs">
            {dartInputs.map((value, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Dart ${i + 1}`}
                value={value}
                onChange={(e) => handleInputChange(i, e.target.value)}
                disabled={!!winner}
              />
            ))}
          </div>
          <button onClick={handleSubmitTurn} disabled={!!winner}>
            Submit Turn
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;