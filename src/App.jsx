import React  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faGem } from '@fortawesome/free-solid-svg-icons';
import Grid from './cmp/grid';
import { useState } from 'react';

export default function App() {

  const [score, setScore] = useState(0);


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
                <div className="grid4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="box"></div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          <div>
            <Grid onScore={(points) => setScore(prev => prev + points)} />
          </div>

        </div>
      </div>
    </>
  );
}
