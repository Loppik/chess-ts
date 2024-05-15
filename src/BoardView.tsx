import React, { useState } from 'react';
import { styled } from 'styled-components';
import BoardBorders from './BoardBorders';
import { CELL_SIZE } from './constants';
import { IStyledComponentProps } from './interfaces';
import { convertBoardLayoutToPosition } from './helpers';
import { TCellPosition, TCellPositionStrict, TFigure } from './types';
import ChessGame from './ChessGame';

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
  onCellClick: (cellPosition: TCellPositionStrict) => () => void;
  firstSelectedPosition: TCellPosition;
}
const Cells = styled(
  ({ board, onCellClick, firstSelectedPosition, className }: ICellsProps) => {
    return (
      <div className={className}>
        {board.map((row, i) => (
          <div key={i} className="d-flex">
            {row.map((cellItem, j) => {
              const cellPosition = convertBoardLayoutToPosition(i, j);
              return (
                <Cell
                  key={j}
                  cellItem={cellItem}
                  isBlack={(j + i) % 2 === 1}
                  isSelected={
                    firstSelectedPosition
                      ? firstSelectedPosition.posX === cellPosition.posX &&
                        firstSelectedPosition.posY === cellPosition.posY
                      : false
                  }
                  onCellClick={onCellClick(cellPosition)}
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

const BoardView = () => {
  const [game] = useState<ChessGame>(new ChessGame());
  const [firstSelectedPosition, setFirstSelectedPosition] =
    useState<TCellPosition>(null);

  const onCellClick = (cellPosition: TCellPositionStrict) => () => {
    if (!firstSelectedPosition) {
      const figure = game.getCell(cellPosition);
      if (figure && figure.color === game.currentMove) {
        setFirstSelectedPosition(cellPosition);
      }
      return;
    }

    if (
      firstSelectedPosition &&
      firstSelectedPosition.posX === cellPosition.posX &&
      firstSelectedPosition.posY === cellPosition.posY
    ) {
      setFirstSelectedPosition(null);
      return;
    }

    const isMoved = game.moveFigure(firstSelectedPosition, cellPosition);
    if (isMoved) {
      setFirstSelectedPosition(null);
      game.endMove();
    }
  };

  return (
    <section>
      <BoardBorders>
        <Cells
          board={game.board}
          onCellClick={onCellClick}
          firstSelectedPosition={firstSelectedPosition}
        />
      </BoardBorders>
    </section>
  );
};

export default BoardView;
