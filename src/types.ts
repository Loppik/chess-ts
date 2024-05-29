import { FigureColor, FigureType } from './constants';

export type TFigure = {
  type: FigureType;
  color: FigureColor;
  img: string;
};
export type TCellItem = TFigure | null;

export type TBoard = Array<Array<TFigure | null>>;
export type TCellPositionStrict = { posX: number; posY: number };
export type TCellPosition = TCellPositionStrict | null;
