import { TCellItem, TCellPositionStrict, TFigure } from './types';
import { FigureType } from './constants';

export class Move {
  public fromPosition: TCellPositionStrict;
  public toPosition: TCellPositionStrict;
  public fromFigure: TFigure;
  public toCellItem: TCellItem;
  public number?: number;

  constructor(
    fromPosition: TCellPositionStrict,
    toPosition: TCellPositionStrict,
    fromFigure: TFigure,
    toCellItem: TCellItem,
  ) {
    this.fromPosition = fromPosition;
    this.toPosition = toPosition;
    this.fromFigure = fromFigure;
    this.toCellItem = toCellItem;
  }

  setMoveNumber(number: number) {
    this.number = number;
  }
}

class History {
  public moves: Move[];
  public moveCounter: number;

  constructor() {
    this.moves = [];
    this.moveCounter = 1;
  }

  addMove(move: Move) {
    move.setMoveNumber(this.moveCounter++);
    this.moves.push(move);
  }

  // TODO: add check sign
  convertMovesToPGNFormat(): string {
    return this.moves.reduce((acc, move, index) => {
      const movesNumber = index % 2 === 0 ? `${Math.ceil(index / 2) + 1}.` : '';
      const res = acc + movesNumber;

      if (move.toCellItem) {
        return (
          res +
          `${this.convertFigureToPGN(move.fromFigure) || this.getPositionFile(move.fromPosition)}x${this.convertPositionToPGN(
            move.toPosition,
          )} `
        );
      }

      return (
        res +
        `${this.convertFigureToPGN(move.fromFigure)}${this.convertPositionToPGN(move.toPosition)} `
      );
    }, '');
  }

  getPositionRank = (position: TCellPositionStrict): string =>
    String(position.posY + 1);
  getPositionFile = (position: TCellPositionStrict): string =>
    String.fromCharCode(97 + position.posX);

  convertPositionToPGN(position: TCellPositionStrict): string {
    return `${this.getPositionFile(position)}${this.getPositionRank(position)}`;
  }

  convertFigureToPGN(figure: TFigure): string {
    switch (figure.type) {
      case FigureType.Pawn:
        return '';
      case FigureType.Knight:
        return 'N';
      case FigureType.Bishop:
        return 'B';
      case FigureType.Rook:
        return 'R';
      case FigureType.Queen:
        return 'Q';
      case FigureType.King:
        return 'K';
      default:
        return '';
    }
  }
}

export default History;
