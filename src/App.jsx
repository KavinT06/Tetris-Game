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

            <div className="side-buttons">
              <button
                onClick={() => document.dispatchEvent(new Event("togglePause"))}
                style={{
                  padding: "10px 16px",
                  background: "#ff77b0",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  width: "120px",
                  marginTop: "20px",
                  marginRight: '20px'
                }}
              >
                Pause
              </button>

              <button
                onClick={() => document.dispatchEvent(new Event("resetGame"))}
                style={{
                  padding: "10px 16px",
                  background: "#d76488",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  width: "120px",
                  marginTop: "12px"
                }}
              >
                Restart
              </button>
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
