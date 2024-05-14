import React, { useState } from 'react';
import { styled } from 'styled-components';
import BoardBorders from './BoardBorders';
import { CELL_SIZE, FigureColor, FigureType } from './constants';
import { IStyledComponentProps } from './interfaces';
import { copyBoard, generateFigure } from './helpers';
import { TBoard, TFigure } from './types';

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
const BORDER_COLOR_OF_THE_SELECTED_CELL = 'red';
interface ICellProps extends IStyledComponentProps {
  cellItem: TFigure | null;
  isBlack: boolean;
  isSelected: boolean;
  onCellClick: () => void;
}
const Cell = styled(({ className, cellItem, onCellClick }: ICellProps) => {
  return (
    <div className={className} onClick={onCellClick}>
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
  ${({ isSelected }) =>
    isSelected && `border-color: ${BORDER_COLOR_OF_THE_SELECTED_CELL};`}
  &:hover {
    cursor: pointer;
    border-color: ${({ isSelected }) =>
      isSelected ? BORDER_COLOR_OF_THE_SELECTED_CELL : 'black'};
  }
`;

interface ICellsProps extends IStyledComponentProps {
  board: (TFigure | null)[][];
  onCellClick: (posX: number, posY: number) => () => void;
  firstSelectedPosition: CellPosition;
}
const Cells = styled(
  ({ board, onCellClick, firstSelectedPosition, className }: ICellsProps) => {
    return (
      <div className={className}>
        {board.map((row, i) => (
          <div key={i} className="d-flex">
            {row.map((cellItem, j) => {
              const posX = i,
                posY = j;
              return (
                <Cell
                  key={j}
                  cellItem={cellItem}
                  isBlack={(j + i) % 2 === 1}
                  isSelected={
                    firstSelectedPosition
                      ? firstSelectedPosition.posX === posX &&
                        firstSelectedPosition.posY === posY
                      : false
                  }
                  onCellClick={onCellClick(posX, posY)}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  },
)`
  grid-row: 2 / 10;
  grid-column: 2 / 10;
`;

type CellPosition = { posX: number; posY: number } | null;
const Board = () => {
  const [board, setBoard] = useState<TBoard>(INITIAL_BOARD);
  const [firstSelectedPosition, setFirstSelectedPosition] =
    useState<CellPosition>(null);

  const onCellClick = (posX: number, posY: number) => () => {
    if (!firstSelectedPosition) {
      setFirstSelectedPosition({ posX, posY });
      return;
    }

    if (
      firstSelectedPosition &&
      posX === firstSelectedPosition.posX &&
      posY === firstSelectedPosition.posY
    ) {
      setFirstSelectedPosition(null);
      return;
    }

    moveFigure(firstSelectedPosition, { posX, posY });
    setFirstSelectedPosition(null);
  };

  const moveFigure = (fromPosition: CellPosition, toPosition: CellPosition) => {
    if (!fromPosition || !toPosition) {
      return;
    }

    const newBoard = copyBoard(board);
    newBoard[toPosition.posX][toPosition.posY] =
      board[fromPosition.posX][fromPosition.posY];
    newBoard[fromPosition.posX][fromPosition.posY] = null;
    setBoard(newBoard);
  };

  return (
    <section>
      <BoardBorders>
        <Cells
          board={board}
          onCellClick={onCellClick}
          firstSelectedPosition={firstSelectedPosition}
        />
      </BoardBorders>
    </section>
  );
};

export default Board;
