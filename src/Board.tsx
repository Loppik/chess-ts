import React from 'react';
import {styled} from 'styled-components';
import BoardBorders from './BoardBorders';
import {CELL_SIZE, FigureColor, FigureType, generateFigure} from './constants';
import {IStyledComponent} from './interfaces';


interface ICellProps extends IStyledComponent {
  cellItem: any
  isBlack: boolean
}
const Cell = styled(({ className, cellItem }: ICellProps) => {
  return (
    <div className={className}>
      {cellItem !== EMPTY_CELL && <img src={`/figures/${cellItem.img}`} alt={`${cellItem.color} ${cellItem.type}`} style={{ width: '80%', height: '80%' }} />}
    </div>
  )
})`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  background: ${({ isBlack }) => isBlack ? 'sienna' : 'antiquewhite'};
`

const Figure = {
  name: '',
  img: '',
  color: ''
}

const EMPTY_CELL = 'x';

const board = [
  [generateFigure(FigureType.Bishop, FigureColor.Black), EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, generateFigure(FigureType.Bishop, FigureColor.White), EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
]

const Cells = styled(({ className }: IStyledComponent) => {
  return (
    <div className={className}>
      {board.map((row, i) => (
        <div className="d-flex">
          {row.map((cellItem, j) => (
            <Cell cellItem={cellItem} isBlack={(j + i) % 2 === 1} />
          ))}
        </div>
      ))}
    </div>
  )
})`
  grid-row: 2 / 10;
  grid-column: 2 / 10;
`

const Board = () => {
  return (
    <section>
      <BoardBorders>
        <Cells />
      </BoardBorders>
    </section>
  );
}

export default Board;