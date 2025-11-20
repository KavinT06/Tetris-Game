import React, { useState, useEffect } from 'react';
import Grid from './cmp/Grid';
import Upcoming from './cmp/Upcoming';

export default function App() {
  const [score, setScore] = useState(0);
  const [nextPiece, setNextPiece] = useState(null);
  const [bestScore, setBestScore] = useState(0);

  // Load best score from localStorage on mount
  useEffect(() => {
    const savedBest = localStorage.getItem('tetrisBestScore');
    if (savedBest) setBestScore(Number(savedBest));
  }, []);

  // Update best score if current score exceeds it
  const handleScore = newScore => {
    setScore(newScore);
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem('tetrisBestScore', newScore);
    }
  };

  return (
    <>
      <div className='head'>
        <h1>Tetris Game</h1>
        <div className='bgrid bmain'>
          <div className='sco'>
            <p>Score</p>
            <div className='hscore'>
              <p>🏆 Highest Score : {bestScore}</p>
            </div>
            <div className='hscore'>
              <p>💎 Your Score : {score}</p>
            </div>

            <div className="upcome">
              <p>UPCOMING</p>
              <div className="up-grid-wrapper">
                <Upcoming nextPiece={nextPiece} />
              </div>
            </div>
          </div>

          <div>
            <Grid onScore={handleScore} onNextPiece={setNextPiece} />
          </div>
        </div>
      </div>
    </>
  );
}
