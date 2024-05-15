import { convertPositionToBoardLayout, generateInitialBoard } from './helpers';
import { FigureColor } from './constants';
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

  moveFigure(fromPosition: TCellPosition, toPosition: TCellPosition) {
    if (!fromPosition || !toPosition) {
      return;
    }

    const toPositionLayout = convertPositionToBoardLayout(toPosition);
    const fromPositionLayout = convertPositionToBoardLayout(fromPosition);
    this.board[toPositionLayout.row][toPositionLayout.col] =
      this.board[fromPositionLayout.row][fromPositionLayout.col];
    this.board[fromPositionLayout.row][fromPositionLayout.col] = null;
  }

  endMove() {
    this.currentMove =
      this.currentMove === FigureColor.White
        ? FigureColor.Black
        : FigureColor.White;
  }
}

export default ChessGame;
