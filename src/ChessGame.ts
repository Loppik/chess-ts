import { convertPositionToBoardLayout, generateInitialBoard } from './helpers';
import { FigureColor, FigureType } from './constants';
import { TBoard, TCellPosition, TCellPositionStrict } from './types';

class ChessGame {
  public board: TBoard;
  public currentMove: FigureColor;

  constructor() {
    this.board = generateInitialBoard();
    this.currentMove = FigureColor.White;
  }

  getCell(cellPosition: TCellPositionStrict) {
    const { row, col } = convertPositionToBoardLayout(cellPosition);
    return this.board[row][col];
  }

  moveFigure(fromPosition: TCellPosition, toPosition: TCellPosition): boolean {
    if (!fromPosition || !toPosition) {
      return false;
    }

    if (
      !this.getPossiblePositions(fromPosition).find(
        (p) => p.posX === toPosition.posX && p.posY === toPosition.posY,
      )
    ) {
      return false;
    }

    const toPositionLayout = convertPositionToBoardLayout(toPosition);
    const fromPositionLayout = convertPositionToBoardLayout(fromPosition);
    this.board[toPositionLayout.row][toPositionLayout.col] =
      this.board[fromPositionLayout.row][fromPositionLayout.col];
    this.board[fromPositionLayout.row][fromPositionLayout.col] = null;
    return true;
  }

  endMove() {
    this.currentMove =
      this.currentMove === FigureColor.White
        ? FigureColor.Black
        : FigureColor.White;
  }

  getPossiblePositions(
    fromPosition: TCellPositionStrict,
  ): TCellPositionStrict[] {
    const figure = this.getCell(fromPosition);
    if (!figure) {
      return [];
    }

    const addPosition = (
      possiblePositions: TCellPositionStrict[],
      position: TCellPositionStrict,
    ): boolean => {
      const cellItem = this.getCell(position);
      if (cellItem && cellItem.color === figure.color) {
        return false;
      }
      possiblePositions.push(position);
      if (cellItem && cellItem.color !== figure.color) {
        return false;
      }
      return true;
    };
    switch (figure.type) {
      case FigureType.Rook: {
        let possiblePositions: TCellPositionStrict[] = [];
        // top
        for (let i = fromPosition.posY + 1; i < 8; i++) {
          const position = { posX: fromPosition.posX, posY: i };
          if (!addPosition(possiblePositions, position)) {
            break;
          }
        }
        // right
        for (let i = fromPosition.posX + 1; i < 8; i++) {
          const position = { posX: i, posY: fromPosition.posY };
          if (!addPosition(possiblePositions, position)) {
            break;
          }
        }
        // bottom
        for (let i = fromPosition.posY - 1; i >= 0; i--) {
          const position = { posX: fromPosition.posX, posY: i };
          if (!addPosition(possiblePositions, position)) {
            break;
          }
        }
        // left
        for (let i = fromPosition.posX - 1; i >= 0; i--) {
          const position = { posX: i, posY: fromPosition.posY };
          if (!addPosition(possiblePositions, position)) {
            break;
          }
        }
        return possiblePositions;
      }
    }
    return [];
  }
}

export default ChessGame;
