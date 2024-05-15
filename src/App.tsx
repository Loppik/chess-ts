import React from 'react';
import BoardBorders from './BoardBorders';
import BoardView from './BoardView';

function App() {
  return (
    <div className="App">
      <BoardBorders>
        <BoardView />
      </BoardBorders>
    </div>
  );
}

export default App;
