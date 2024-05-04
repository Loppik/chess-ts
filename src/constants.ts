export const CELL_SIZE = 100;

export enum FigureColor {
  White = 'white',
  Black = 'black',
}

export enum FigureType {
  Bishop = 'bishop',
}

export const generateFigure = (type: FigureType, color: FigureColor) => ({
  type,
  color,
  img: 'WhiteBishop.png',
});
