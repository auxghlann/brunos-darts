import { useState, useMemo, useEffect, useCallback } from 'react';
import { DartsGame, Player } from './game';
import Dartboard from './components/Dartboard';
import SettingsModal from './components/SettingsModal';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [startingScore, setStartingScore] = useState(501);
  // useMemo to instantiate the game only once
  const game = useMemo(() => new DartsGame(startingScore), [startingScore]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [winner, setWinner] = useState<Player | undefined>(undefined);
  const [dartInputs, setDartInputs] = useState(['', '', '']);
  const [inputErrors, setInputErrors] = useState(['', '', '']);
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

  const isValidThrowNotation = (input: string): boolean => {
    const value = input.trim().toUpperCase();
    if (['', '0', 'BULL', '50', 'OB', '25'].includes(value)) return true;

    let scorePartStr = value;
    if (value.startsWith('T') || value.startsWith('D')) {
      scorePartStr = value.substring(1);
    }

    const scorePart = parseInt(scorePartStr, 10);

    if (isNaN(scorePart) || scorePart.toString() !== scorePartStr || scorePart < 1 || scorePart > 20) {
      return false;
    }

    return true;
  };

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
    if (winner || dartInputs.every(input => input.trim() === '') || inputErrors.some(e => e !== '')) {
      if (inputErrors.some(e => e !== '')) {
        alert('Please correct the invalid scores before submitting.');
      }
      return;
    }

    const scores = dartInputs.map(parseScore);
    game.recordTurn(scores);
    updateGameState();
    setDartInputs(['', '', '']);
    setInputErrors(['', '', '']);

    if (game.getWinner()) {
      alert(`${game.getWinner()?.name} wins the game!`);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...dartInputs];
    newInputs[index] = value;
    setDartInputs(newInputs);

    const newErrors = [...inputErrors];
    if (value.trim() !== '' && !isValidThrowNotation(value)) {
      newErrors[index] = 'Invalid';
    } else {
      newErrors[index] = '';
    }
    setInputErrors(newErrors);
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <>
      <Header onSettingsClick={() => setSettingsOpen(true)} />

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
              <div key={i} className="input-container">
                <input
                  type="text"
                  placeholder={`Dart ${i + 1}`}
                  value={value}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  disabled={!!winner}
                  style={{ borderColor: inputErrors[i] ? '#ff4747' : '' }}
                />
                {inputErrors[i] && <span className="input-error">{inputErrors[i]}</span>}
              </div>
            ))}
          </div>
          <button onClick={handleSubmitTurn} disabled={!!winner || inputErrors.some(e => e !== '')}>
            Submit Turn
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;