import React from 'react';
import { styled } from 'styled-components';
import { CELL_SIZE } from './constants';
import {IStyledComponent} from './interfaces';

const BorderSymbol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`
const RowNumber = styled(BorderSymbol)`
  width: 30px;
  height: ${CELL_SIZE}px;
`
const ColumnLetter = styled(BorderSymbol)`
  width: ${CELL_SIZE}px;
  height: 30px;
`

const BoardContainer = styled.div`
  display: grid;
  grid-template-rows: 30px repeat(8, ${CELL_SIZE}px) 30px;
  grid-template-columns: 30px repeat(8, ${CELL_SIZE}px) 30px;
`

const LeftBoarder = styled(({ className }: IStyledComponent) => (
  <div className={className}>
    <div>
      {Array(8).fill(1).map((item, i) => (
        <RowNumber>{8-i}</RowNumber>
      ))}
    </div>
  </div>
))`
  display: flex;
  grid-row: 2 / 10;
  grid-column: 1 / 2;
`
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const BottomBoarder = styled(({ className }: IStyledComponent) => (
  <div className={className}>
    {Array(8).fill(1).map((item, i) => (
        <ColumnLetter>{LETTERS[i]}</ColumnLetter>
      )
    )}
  </div>
))`
  display: flex;
  grid-row: 10 / 11;
  grid-column: 2 / 10;
`

const BoardBorders = (props: any) => {
  return (
    <BoardContainer>
      <LeftBoarder />
      <BottomBoarder />
      {React.Children.map(props.children, child => child)}
    </BoardContainer>
  )
}

export default BoardBorders;