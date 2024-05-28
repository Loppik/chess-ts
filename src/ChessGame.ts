import {
  convertPositionToBoardLayout,
  generateFigure,
  generateInitialBoard,
} from './helpers';
import { FigureColor, FigureType } from './constants';
import { TBoard, TCellPosition, TCellPositionStrict, TFigure } from './types';

const createPos =
  (fromPosition: TCellPositionStrict) =>
  (xDiff: number, yDiff: number): TCellPositionStrict => ({
    posX: fromPosition.posX + xDiff,
    posY: fromPosition.posY + yDiff,
  });

class ChessGame {
  public board: TBoard;
  public currentMove: FigureColor;

  constructor() {
    this.board = generateInitialBoard();
    this.currentMove = FigureColor.White;
  }

  getCell(cellPosition: TCellPositionStrict) {
    const { row, col } = convertPositionToBoardLayout(cellPosition);
    return this.board[row]?.[col];
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
    asFigure?: TFigure,
  ): TCellPositionStrict[] {
    const figure = asFigure || this.getCell(fromPosition);
    if (!figure) {
      return [];
    }

    switch (figure.type) {
      case FigureType.Pawn: {
        const newPossiblePositions = [];
        const yDirection = figure.color === FigureColor.White ? 1 : -1;
        const position = createPos(fromPosition)(0, yDirection);
        if (!this.getCell(position)) {
          newPossiblePositions.push(position);
          if (
            (figure.color === FigureColor.White && fromPosition.posY === 1) ||
            (figure.color === FigureColor.Black && fromPosition.posY === 6)
          ) {
            const position2 = createPos(fromPosition)(0, yDirection * 2);
            if (!this.getCell(position2)) {
              newPossiblePositions.push(position2);
            }
          }
        }
        const leftAttackPosition = createPos(fromPosition)(-1, yDirection);
        const leftAttackCell = this.getCell(leftAttackPosition);
        if (leftAttackCell && leftAttackCell.color !== figure.color) {
          newPossiblePositions.push(leftAttackPosition);
        }
        const rightAttackPosition = createPos(fromPosition)(1, yDirection);
        const rightAttackCell = this.getCell(rightAttackPosition);
        if (rightAttackCell && rightAttackCell.color !== figure.color) {
          newPossiblePositions.push(rightAttackPosition);
        }
        return newPossiblePositions;
      }
      case FigureType.Rook:
      case FigureType.Bishop: {
        const getPossibleOneDirectionPositions =
          (fromPosition: TCellPositionStrict) =>
          (xDiff: number, yDiff: number): TCellPositionStrict[] => {
            const newPossiblePositions = [];
            let position = createPos(fromPosition)(xDiff, yDiff);
            while (
              position.posX >= 0 &&
              position.posX < 8 &&
              position.posY >= 0 &&
              position.posY < 8
            ) {
              const cellItem = this.getCell(position);
              if (cellItem) {
                if (cellItem.color !== figure.color) {
                  newPossiblePositions.push(position);
                }
                break;
              }
              newPossiblePositions.push(position);
              position = createPos(position)(xDiff, yDiff);
            }
            return newPossiblePositions;
          };
        const getPossibleOneDirectionPositionsFromPosition =
          getPossibleOneDirectionPositions(fromPosition);
        if (figure.type === FigureType.Rook) {
          return [
            ...getPossibleOneDirectionPositionsFromPosition(1, 0),
            ...getPossibleOneDirectionPositionsFromPosition(-1, 0),
            ...getPossibleOneDirectionPositionsFromPosition(0, 1),
            ...getPossibleOneDirectionPositionsFromPosition(0, -1),
          ];
        }
        if (figure.type == FigureType.Bishop) {
          return [
            ...getPossibleOneDirectionPositionsFromPosition(1, 1),
            ...getPossibleOneDirectionPositionsFromPosition(1, -1),
            ...getPossibleOneDirectionPositionsFromPosition(-1, 1),
            ...getPossibleOneDirectionPositionsFromPosition(-1, -1),
          ];
        }
        break;
      }
      case FigureType.Knight: {
        const getPossibleKnightPosition = (
          x: number,
          y: number,
        ): TCellPosition => {
          const position = createPos(fromPosition)(x, y);
          const cellItem = this.getCell(position);
          if (
            cellItem ? cellItem.color === figure.color : cellItem === undefined
          ) {
            return null;
          }
          return position;
        };
        return [
          getPossibleKnightPosition(2, 1),
          getPossibleKnightPosition(2, -1),
          getPossibleKnightPosition(-2, 1),
          getPossibleKnightPosition(-2, -1),
          getPossibleKnightPosition(1, 2),
          getPossibleKnightPosition(1, -2),
          getPossibleKnightPosition(-1, 2),
          getPossibleKnightPosition(-1, -2),
        ].filter(Boolean) as TCellPositionStrict[];
      }
      case FigureType.Queen: {
        return [
          ...this.getPossiblePositions(
            fromPosition,
            generateFigure(FigureType.Rook, figure.color),
          ),
          ...this.getPossiblePositions(
            fromPosition,
            generateFigure(FigureType.Bishop, figure.color),
          ),
        ];
      }
      case FigureType.King: {
        const getPossibleKingPosition = (
          x: number,
          y: number,
        ): TCellPosition => {
          const position = createPos(fromPosition)(x, y);
          const cellItem = this.getCell(position);
          if (
            cellItem ? cellItem.color === figure.color : cellItem === undefined
          ) {
            return null;
          }
          return position;
        };
        return [
          getPossibleKingPosition(1, 1),
          getPossibleKingPosition(1, 0),
          getPossibleKingPosition(1, -1),
          getPossibleKingPosition(0, 1),
          getPossibleKingPosition(0, -1),
          getPossibleKingPosition(-1, 1),
          getPossibleKingPosition(-1, 0),
          getPossibleKingPosition(-1, -1),
        ].filter(Boolean) as TCellPositionStrict[];
      }
    }
    return [];
  }
}

export default ChessGame;
