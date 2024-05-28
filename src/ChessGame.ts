import {
  convertPositionToBoardLayout,
  generateFigure,
  generateInitialBoard,
} from './helpers';
import { FigureColor, FigureType } from './constants';
import { TBoard, TCellPosition, TCellPositionStrict } from './types';

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
  ): TCellPositionStrict[] {
    const figure = this.getCell(fromPosition);
    if (!figure) {
      return [];
    }

    const addPositionPawn = (
      possiblePositions: TCellPositionStrict[],
      position: TCellPositionStrict,
    ): void => {
      if (this.getCell(position)?.color === figure.color) {
        return;
      }
      possiblePositions.push(position);
    };
    switch (figure.type) {
      case FigureType.Pawn: {
        let possibleEmptyPositions: TCellPositionStrict[] = [];
        if (figure.color === FigureColor.White) {
          addPositionPawn(possibleEmptyPositions, {
            posX: fromPosition.posX,
            posY: fromPosition.posY + 1,
          });
          if (fromPosition.posY === 1) {
            addPositionPawn(possibleEmptyPositions, {
              posX: fromPosition.posX,
              posY: fromPosition.posY + 2,
            });
          }
        } else {
          addPositionPawn(possibleEmptyPositions, {
            posX: fromPosition.posX,
            posY: fromPosition.posY - 1,
          });
          if (fromPosition.posY === 6) {
            addPositionPawn(possibleEmptyPositions, {
              posX: fromPosition.posX,
              posY: fromPosition.posY - 2,
            });
          }
        }
        let possibleAttackPositions: TCellPositionStrict[] = [];
        const filterAttackPositionsByPossibleMove = (
          figureColor: FigureColor,
          attackPositions: TCellPositionStrict[],
        ): TCellPositionStrict[] => {
          return attackPositions.filter((pos) => {
            const figure = this.getCell(pos);
            return figure && figure.color !== figureColor;
          });
        };
        if (figure.color === FigureColor.White) {
          possibleAttackPositions = possibleAttackPositions.concat(
            filterAttackPositionsByPossibleMove(FigureColor.White, [
              {
                posX: fromPosition.posX + 1,
                posY: fromPosition.posY + 1,
              },
              {
                posX: fromPosition.posX - 1,
                posY: fromPosition.posY + 1,
              },
            ]),
          );
        } else {
          possibleAttackPositions = possibleAttackPositions.concat(
            filterAttackPositionsByPossibleMove(FigureColor.Black, [
              {
                posX: fromPosition.posX + 1,
                posY: fromPosition.posY - 1,
              },
              {
                posX: fromPosition.posX - 1,
                posY: fromPosition.posY - 1,
              },
            ]),
          );
        }

        return possibleEmptyPositions.concat(possibleAttackPositions);
      }
      case FigureType.Rook: {
        let possiblePositions: TCellPositionStrict[] = [];
        const getPossiblePositionsForRook = (
          xDiff: number,
          yDiff: number,
        ): TCellPositionStrict[] => {
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
        possiblePositions = possiblePositions.concat(
          getPossiblePositionsForRook(1, 0),
        );
        possiblePositions = possiblePositions.concat(
          getPossiblePositionsForRook(-1, 0),
        );
        possiblePositions = possiblePositions.concat(
          getPossiblePositionsForRook(0, 1),
        );
        possiblePositions = possiblePositions.concat(
          getPossiblePositionsForRook(0, -1),
        );
        return possiblePositions;
      }
      case FigureType.Knight: {
        let possiblePositions: TCellPositionStrict[] = [];
        const addPositionKnight = (
          x: number,
          y: number,
          possiblePositions: TCellPositionStrict[],
        ): TCellPositionStrict[] => {
          const position = createPos(fromPosition)(x, y);
          const cellItem = this.getCell(position);
          if (
            cellItem ? cellItem.color === figure.color : cellItem === undefined
          ) {
            return possiblePositions;
          }
          return possiblePositions.concat(position);
        };
        possiblePositions = addPositionKnight(2, 1, possiblePositions);
        possiblePositions = addPositionKnight(2, -1, possiblePositions);
        possiblePositions = addPositionKnight(-2, 1, possiblePositions);
        possiblePositions = addPositionKnight(-2, -1, possiblePositions);
        possiblePositions = addPositionKnight(1, 2, possiblePositions);
        possiblePositions = addPositionKnight(1, -2, possiblePositions);
        possiblePositions = addPositionKnight(-1, 2, possiblePositions);
        possiblePositions = addPositionKnight(-1, -2, possiblePositions);
        return possiblePositions;
      }
      case FigureType.Bishop: {
        let possiblePositions: TCellPositionStrict[] = [];
        const getPossibleDiagonalPositionsForBishop = (
          xDiff: number,
          yDiff: number,
        ): TCellPositionStrict[] => {
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
        possiblePositions = possiblePositions.concat(
          getPossibleDiagonalPositionsForBishop(1, 1),
        );
        possiblePositions = possiblePositions.concat(
          getPossibleDiagonalPositionsForBishop(1, -1),
        );
        possiblePositions = possiblePositions.concat(
          getPossibleDiagonalPositionsForBishop(-1, 1),
        );
        possiblePositions = possiblePositions.concat(
          getPossibleDiagonalPositionsForBishop(-1, -1),
        );
        return possiblePositions;
      }
    }
    return [];
  }
}

export default ChessGame;
