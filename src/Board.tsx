import React, { useState } from 'react';
import { styled } from 'styled-components';
import BoardBorders from './BoardBorders';
import { CELL_SIZE, FigureColor, FigureType } from './constants';
import { IStyledComponentProps } from './interfaces';
import { generateFigure } from './helpers';
import { Figure } from './types';

const INITIAL_BOARD = [
  [null, null, null, null, null, null, null, null],
  [
    generateFigure(FigureType.Pawn, FigureColor.Black),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    null,
    generateFigure(FigureType.Pawn, FigureColor.White),
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [null, null, null, null, null, null, null, null],
];

const BORDER_SIZE = 5;
interface ICellProps extends IStyledComponentProps {
  cellItem: Figure | null;
  isBlack: boolean;
}
const Cell = styled(({ className, cellItem }: ICellProps) => {
  return (
    <div className={className}>
      {cellItem && (
        <img
          src={`/figures/${cellItem.img}`}
          alt={`${cellItem.color} ${cellItem.type}`}
          style={{ width: '80%', height: '80%' }}
        />
      )}
    </div>
  );
})`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE - BORDER_SIZE * 2}px;
  background: ${({ isBlack }) => (isBlack ? 'sienna' : 'antiquewhite')};
  border: ${BORDER_SIZE}px solid transparent;
  &:hover {
    cursor: pointer;
    border-color: black;
  }
`;

interface ICellsProps extends IStyledComponentProps {
  board: (Figure | null)[][];
}
const Cells = styled(({ board, className }: ICellsProps) => {
  return (
    <div className={className}>
      {board.map((row, i) => (
        <div key={i} className="d-flex">
          {row.map((cellItem, j) => (
            <Cell key={j} cellItem={cellItem} isBlack={(j + i) % 2 === 1} />
          ))}
        </div>
      ))}
    </div>
  );
})`
  grid-row: 2 / 10;
  grid-column: 2 / 10;
`;

const Board = () => {
  const [board] = useState(INITIAL_BOARD);

  return (
    <section>
      <BoardBorders>
        <Cells board={board} />
      </BoardBorders>
    </section>
  );
};

export default Board;
