import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
 
function App() {
  const [score, setScore] = useState(0);

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
  };

  const handleReset = () => {
    setScore(0);
  };

  return (
    <div className="app">
      <h1>Snake Game 🐍</h1>
      <div className="score-board">
        <h2>Score: {score}</h2>
        <button onClick={handleReset}>
          <FontAwesomeIcon icon={faRedo} /> Reset
        </button>
      </div>
      <GameBoard onScoreUpdate={handleScoreUpdate} />
    </div>
  );
}

export default App;
