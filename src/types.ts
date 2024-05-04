import { FigureColor, FigureType } from './constants';

export type Figure = {
  type: FigureType;
  color: FigureColor;
  img: string;
};
