import React from 'react';
import BoardBorders from './BoardBorders';
import Board from './Board';

function App() {
  return (
    <div className="App">
      <BoardBorders>
        <Board />
      </BoardBorders>
    </div>
  );
}

export default App;
