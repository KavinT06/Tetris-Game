import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faGem } from '@fortawesome/free-solid-svg-icons';
import Grid from './cmp/grid';

export default function App() {
  return (
    <>
      <div className='head'>
        <h1>Tetris Game</h1>
        <div className='bgrid bmain'>
          <div className='sco'>
            <p>Score</p>

            <div className='hscore'><p>🏆 Highest Score : 10245</p></div>
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
            <Grid />
          </div>

        </div>
      </div>
    </>
  );
}
