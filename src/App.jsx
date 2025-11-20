import React from 'react';
import Grid from './cmp/Grid';
import Upcoming from './cmp/Upcoming';
import { useState } from 'react';

export default function App() {

  const [score, setScore] = useState(0);
  const [nextPiece, setNextPiece] = useState(null);


  return (
    <>
      <div className='head'>
        <h1>Tetris Game</h1>
        <div className='bgrid bmain'>
          <div className='sco'>
            <p>Score</p>

            <div className='hscore'><p>🏆 Highest Score : {score}</p></div>
            <div className='hscore'><p>💎 Your Score : 10245</p></div>

            <div className="upcome">
              <p>UPCOMING</p>

              <div className="up-grid-wrapper">
                <Upcoming nextPiece={nextPiece} />
              </div>


            </div>


          </div>

          <div>
            <Grid onScore={setScore} onNextPiece={setNextPiece} />
          </div>

        </div>
      </div>
    </>
  );
}
