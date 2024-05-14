import { FigureColor, FigureType } from './constants';

export type TFigure = {
  type: FigureType;
  color: FigureColor;
  img: string;
};

export type TBoard = Array<Array<TFigure | null>>;
