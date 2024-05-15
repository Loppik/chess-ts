import { convertPositionToBoardLayout, generateInitialBoard } from './helpers';
import { FigureColor, FigureType } from './constants';
import { TBoard, TCellPosition, TCellPositionStrict, TFigure } from './types';

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
      !this.checkIsCorrectMove(
        this.getCell(fromPosition)!,
        fromPosition,
        toPosition,
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

  checkIsCorrectMove(
    figure: TFigure,
    fromPosition: TCellPositionStrict,
    toPosition: TCellPositionStrict,
  ) {
    if (figure.type === FigureType.Pawn) {
      if (figure.color === FigureColor.White) {
        const defaultMove =
          toPosition.posX === fromPosition.posX &&
          toPosition.posY === fromPosition.posY + 1;

        if (fromPosition.posY === 1) {
          return (
            defaultMove ||
            (toPosition.posX === fromPosition.posX &&
              toPosition.posY === fromPosition.posY + 2)
          );
        }
        return defaultMove;
      } else {
        const defaultMove =
          toPosition.posX === fromPosition.posX &&
          toPosition.posY === fromPosition.posY - 1;

        if (fromPosition.posY === 6) {
          return (
            defaultMove ||
            (toPosition.posX === fromPosition.posX &&
              toPosition.posY === fromPosition.posY - 2)
          );
        }
        return defaultMove;
      }
    } else if (figure.type === FigureType.Rook) {
      return (
        toPosition.posX === fromPosition.posX ||
        toPosition.posY === fromPosition.posY
      );
    }
  }

  endMove() {
    this.currentMove =
      this.currentMove === FigureColor.White
        ? FigureColor.Black
        : FigureColor.White;
  }
}

export default ChessGame;
