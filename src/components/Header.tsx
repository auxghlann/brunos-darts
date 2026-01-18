import React from 'react';
import SettingsIcon from './SettingsIcon';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="app-header">
      <h1>Darts Scorer</h1>
      <button className="settings-button" onClick={onSettingsClick}>
        <SettingsIcon />
      </button>
    </header>
  );
};

export default Header;