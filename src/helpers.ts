import { FigureColor, FigureType } from './constants';
import { Figure } from './types';

export const capitalizeFirstLetter = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const generateFigure = (
  type: FigureType,
  color: FigureColor,
): Figure => ({
  type,
  color,
  img: `${capitalizeFirstLetter(color)}${capitalizeFirstLetter(type)}.png`,
});
