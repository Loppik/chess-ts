import { FigureColor, FigureType } from './constants';
import { TBoard, TFigure } from './types';

export const capitalizeFirstLetter = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const generateFigure = (
  type: FigureType,
  color: FigureColor,
): TFigure => ({
  type,
  color,
  img: `${capitalizeFirstLetter(color)}${capitalizeFirstLetter(type)}.png`,
});

export const generateWhiteFigure = (type: FigureType): TFigure =>
  generateFigure(type, FigureColor.White);
export const generateBlackFigure = (type: FigureType): TFigure =>
  generateFigure(type, FigureColor.Black);

export const generateInitialBoard = (): TBoard => [
  [
    generateBlackFigure(FigureType.Rook),
    generateBlackFigure(FigureType.Knight),
    generateBlackFigure(FigureType.Bishop),
    generateBlackFigure(FigureType.Queen),
    generateBlackFigure(FigureType.King),
    generateBlackFigure(FigureType.Bishop),
    generateBlackFigure(FigureType.Knight),
    generateBlackFigure(FigureType.Rook),
  ],
  [
    generateBlackFigure(FigureType.Pawn),
    generateBlackFigure(FigureType.Pawn),
    generateBlackFigure(FigureType.Pawn),
    generateBlackFigure(FigureType.Pawn),
    generateBlackFigure(FigureType.Pawn),
    generateBlackFigure(FigureType.Pawn),
    generateBlackFigure(FigureType.Pawn),
    generateBlackFigure(FigureType.Pawn),
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    generateWhiteFigure(FigureType.Pawn),
    generateWhiteFigure(FigureType.Pawn),
    generateWhiteFigure(FigureType.Pawn),
    generateWhiteFigure(FigureType.Pawn),
    generateWhiteFigure(FigureType.Pawn),
    generateWhiteFigure(FigureType.Pawn),
    generateWhiteFigure(FigureType.Pawn),
    generateWhiteFigure(FigureType.Pawn),
  ],
  [
    generateWhiteFigure(FigureType.Rook),
    generateWhiteFigure(FigureType.Knight),
    generateWhiteFigure(FigureType.Bishop),
    generateWhiteFigure(FigureType.Queen),
    generateWhiteFigure(FigureType.King),
    generateWhiteFigure(FigureType.Bishop),
    generateWhiteFigure(FigureType.Knight),
    generateWhiteFigure(FigureType.Rook),
  ],
];

export const copyBoard = (board: TBoard): TBoard =>
  board.map((row) => [...row]);
