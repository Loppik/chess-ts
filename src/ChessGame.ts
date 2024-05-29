import {
  convertBoardLayoutToPosition,
  convertPositionToBoardLayout,
  generateFigure,
  generateInitialBoard,
} from './helpers';
import { FigureColor, FigureType } from './constants';
import {
  TBoard,
  TCellItem,
  TCellPosition,
  TCellPositionStrict,
  TFigure,
} from './types';
import History, { Move } from './History';

const createPos =
  (fromPosition: TCellPositionStrict) =>
  (xDiff: number, yDiff: number): TCellPositionStrict => ({
    posX: fromPosition.posX + xDiff,
    posY: fromPosition.posY + yDiff,
  });

class ChessGame {
  public board: TBoard;
  public currentMove: FigureColor;
  public history: History;

  constructor() {
    this.board = generateInitialBoard();
    this.currentMove = FigureColor.White;
    this.history = new History();
  }

  getCell(cellPosition: TCellPositionStrict): TCellItem {
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

    this.addMoveToHistory(fromPosition, toPosition);

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

  findPositionsOfFigures(
    condition: (cellItem: TCellItem) => boolean,
  ): TCellPositionStrict[] {
    const positions: TCellPositionStrict[] = [];
    this.board.forEach((row, rowIndex) => {
      row.forEach((cellItem, colIndex) => {
        if (condition(cellItem)) {
          positions.push(convertBoardLayoutToPosition(rowIndex, colIndex));
        }
      });
    });
    return positions;
  }

  getIsMovePossibleWithAnotherFigureWithTheSameType = (
    figure: TFigure,
    toPosition: TCellPositionStrict,
  ) => {
    const positionsOfTheSameTypeFigures = this.findPositionsOfFigures(
      (cellItem) =>
        cellItem?.type === figure.type && cellItem.color === figure.color,
    );
    const positionsOfTheSameTypeFiguresThatCanDoTheSameMove =
      positionsOfTheSameTypeFigures.filter((position) => {
        return this.getPossiblePositions(position).find(
          (possiblePos) =>
            possiblePos.posX === toPosition.posX &&
            possiblePos.posY === toPosition.posY,
        );
      });
    return positionsOfTheSameTypeFiguresThatCanDoTheSameMove.length > 1;
  };

  addMoveToHistory(
    fromPosition: TCellPositionStrict,
    toPosition: TCellPositionStrict,
  ) {
    const fromFigure = this.getCell(fromPosition)!;

    this.history.addMove(
      new Move(
        fromPosition,
        toPosition,
        fromFigure,
        this.getCell(toPosition),
        this.getIsMovePossibleWithAnotherFigureWithTheSameType(
          fromFigure,
          toPosition,
        ),
      ),
    );
  }
}

export default ChessGame;
