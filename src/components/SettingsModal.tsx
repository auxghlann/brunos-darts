import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: (score: number) => void;
  onReset: () => void;
  currentScore: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onNewGame, onReset, currentScore }) => {
  const [customScore, setCustomScore] = useState(currentScore.toString());

  if (!isOpen) return null;

  const handleCustomScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomScore(e.target.value);
  };

  const handleStartCustomGame = () => {
    const score = parseInt(customScore, 10);
    if (!isNaN(score) && score > 0) {
      onNewGame(score);
      onClose();
    }
  };

  const handlePresetGame = (score: number) => {
    onNewGame(score);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>
        <button onClick={onClose} className="close-button">&times;</button>
        
        <div className="setting-section">
          <h3>Start New Game</h3>
          <div className="preset-buttons">
            <button onClick={() => handlePresetGame(301)}>301</button>
            <button onClick={() => handlePresetGame(501)}>501</button>
          </div>
          <div className="custom-game">
            <input 
              type="number" 
              value={customScore} 
              onChange={handleCustomScoreChange} 
              placeholder="Custom score"
            />
            <button onClick={handleStartCustomGame}>Start Custom</button>
          </div>
        </div>

        <div className="setting-section">
          <h3>Current Game</h3>
          <button onClick={() => { onReset(); onClose(); }}>Reset Current Game</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;