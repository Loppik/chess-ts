import { FigureColor, FigureType } from './constants';
import { TFigure, TBoard } from './types';

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

export const copyBoard = (board: TBoard): TBoard =>
  board.map((row) => [...row]);
